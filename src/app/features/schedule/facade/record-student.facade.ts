import {computed, DestroyRef, effect, inject, Injectable, signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {EAppPages} from "@models/router.model";
import {selectAllUsers} from "@users/store/selectors";
import {RouterActions} from "../../../store/router/actions";
import {UserActions} from "@users/store/actions";
import {EHeaderMenu, EUserPages} from "@users/models/user.model";
import {IUser, EUserRole} from "@models/user.model";
import {ScheduleListStore} from "@schedule/store/schedule-list.store";
import {DatePipe} from "@angular/common";
import {LessonsStore} from "@lessons/store/lessons.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentsStore} from "@users/store/students.store";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class RecordStudentFacade {
  private store = inject<Store<AppState>>(Store);
  public scheduleListStore = inject(ScheduleListStore);
  public lessonsStore = inject(LessonsStore);
  public studentsStore = inject(StudentsStore);

  private datePipe = inject(DatePipe);
  private profileFacade = inject(ProfileFacade);
  private searchSubject$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  public readonly profile = this.profileFacade.profile;

  public studentsList = computed(() => {
    if (this.profileFacade.isAdmin()) {
      return this.store.selectSignal(selectAllUsers)();
    } else {
      return this.studentsStore.studentsList();
    }
  });

  constructor() {
    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((search) => {
      this.getStudents(search)
    })
  }

  public getStudents(search: string): void {
    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page: 1, search}));
    } else {
      this.studentsStore.loadStudentsList(search);
    }
  }

  public searchUser(search: string): void {
    this.searchSubject$.next(search);
  }

  public goToSchedule(): void {
    const dateTo = new Date();
    dateTo.setMonth(dateTo.getMonth() + 2);
    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');

    let params = {
      tab: EHeaderMenu.Schedule,
      from,
      to
    }

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Users, EUserPages.ListUsers],
      extras: {queryParams: params}
    }))
  }

  public selectedStudent(student: IUser): void {
    this.scheduleListStore.updateCurrentStudentLocally(student);
    this.lessonsStore.updateCurrentUser(student);
  }

  public recordStudent(): void {
    const data = {
      student_id: this.scheduleListStore.currentStudent()?.id,
      slot_id: this.scheduleListStore.currentSlotId()
    }

    setTimeout(() => {
      if (this.profileFacade.isTeacher()) {
        this.lessonsStore.bookAsTeacher(data);
      }

      if (this.profileFacade.isAdmin()) {
        this.lessonsStore.bookIndividualAsAdmin(data);
      }
    })
  }
}