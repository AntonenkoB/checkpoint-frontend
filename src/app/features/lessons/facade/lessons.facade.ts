import {computed, inject, Injectable, signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EHeaderMenu, EUserPages} from "@users/models/user.model";
import {EUserRole, IUser} from "@models/user.model";
import {RouterActions} from "../../../store/router/actions";
import {
  ELessonFlow,
  ELessonPages,
  ELessonsRecordType,
  ELessonsType,
  ICancelLesson
} from "@lessons/models/lessons.model";
import {DatePipe} from "@angular/common";
import {LessonsStore} from "@lessons/store/lessons.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {EMarketPages} from "@market/models/market.model";
import {UserActions} from "@users/store/actions";
import {selectAllUsers} from "@users/store/selectors";
import {ESettingsPages} from "@settings/models/settings.model";


@Injectable({ providedIn: 'root' })
export class LessonsFacade {
  private store = inject<Store<AppState>>(Store);
  private datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  public lessonsStore = inject(LessonsStore);
  public profileFacade = inject(ProfileFacade);

  private queryParams = toSignal(this.route.queryParams);
  public currentRecordTab = computed(() => this.queryParams()?.['recordType']);
  public currentLessonsFlow = computed(() => this.queryParams()?.['lessonsFlow']);
  public currentLessonsType = computed(() => this.queryParams()?.['lessonsType']);
  public teacherListToFreeLessons = signal<IUser[]>([]);
  public choseTeacher = signal(false)

  public readonly profile = this.profileFacade.profile;
  public readonly isStudent = this.profileFacade.isStudent;
  public readonly slots = this.lessonsStore.slots;
  public readonly currentActionUser = this.lessonsStore.currentUser;
  public readonly studentTeachers = computed(() => {
    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      return this.store.selectSignal(selectAllUsers)();
    }

    let teachers =  this.profile()?.teachers ?? [];
    let purchases =  this.profile()?.purchases ?? [];

    return teachers.map(teacher => ({
      ...teacher,
      purchases: purchases.filter(p => p.teacher?.id === teacher?.id)
    }) as IUser);
  });

  constructor() {
  }

  public selectedLessonType(type: ELessonsType): void {
    if (this.currentLessonsFlow() === ELessonFlow.Booking) {
      if (type === ELessonsType.TeacherGuided) {
        const moreOneTeacher = this.studentTeachers().length > 1;

        if (moreOneTeacher) {
          this.goToSelectTeacher(type);
        } else {
          const teacher = this.studentTeachers()[0]!;
          this.lessonsStore.updateCurrentUser(teacher);
          this.goToSelectTime(type);
        }
      } else {
        this.goToSelectTime(type);
      }
    }

    if (this.currentLessonsFlow() === ELessonFlow.Purchase) {
      if (type === ELessonsType.TeacherGuided) {
        let moreOneTeacher = this.studentTeachers().length > 1;

        if (moreOneTeacher) {
          this.goToSelectTeacher(type);
          return;
        }

        const teacher = this.studentTeachers()[0]!;
        this.lessonsStore.updateCurrentUser(teacher);
        this.goToPayment(teacher.id);
      } else {
        this.goToPayment(0);
      }
    }

    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      this.goToSelectTeacher(type);
    }
  }

  public goToSelectTeacher(lessonsType: ELessonsType): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.SelectTeacher],
      extras: {
        queryParams: {lessonsType, lessonsFlow: this.currentLessonsFlow()},
        queryParamsHandling: 'merge'
      }
    }))
  }

  public selectTeacher(user: IUser): void {
    this.lessonsStore.updateCurrentUser(user);

    if (this.currentLessonsFlow() === ELessonFlow.Booking) {
      this.goToSelectTime(ELessonsType.TeacherGuided);
    }

    if (this.currentLessonsFlow() === ELessonFlow.Purchase) {
      let teacherId = user.id
      this.goToPayment(teacherId);
    }

    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      let teacherId = user.id
      if (this.currentLessonsType() === ELessonsType.SelfStudy) {
        this.goToPayment(0);
        return;
      }

      const teachers = user.teachers?.length! > 1

      if (teachers) {
        this.teacherListToFreeLessons.set(
          (user.teachers as IUser[]) ?? []
        );

        this.choseTeacher.set(true);
      } else {
        const teacher = user.teachers?.[0];
        teacherId = teacher?.id ?? 0
        this.goToPayment(teacherId);
      }
    }
  }

  public selectTeacherToFreeLessons(user: IUser): void {
    this.goToPayment(user.id);
  }

  public goToSelectTime(type?: ELessonsType): void {
    const dateTo = new Date();

    if (type === ELessonsType.TeacherGuided) {
      dateTo.setMonth(dateTo.getMonth() + 2);
    } else {
      dateTo.setDate(dateTo.getDate() + 7);
    }

    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');
    const teacherId = type === ELessonsType.TeacherGuided ? this.lessonsStore.currentUser()?.id! : 0;
    const lessonsType = type ? type : this.currentLessonsType();

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, teacherId, ELessonPages.RecordTime],
      extras: {
        queryParams: {from, to, lessonsType},
        queryParamsHandling: 'merge'
      }
    }))
  }

  public goToPayment(teacherId: number): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Market, EMarketPages.PaymentType, teacherId],
      extras: {
        queryParamsHandling: 'merge'
      }
    }))
  }

  public goToStudentMain(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student], back: true}))
  }

  public goToTransferringTime(): void {
    const dateTo = new Date();

    if (this.currentLessonsType() === ELessonsType.TeacherGuided) {
      dateTo.setMonth(dateTo.getMonth() + 2);
    } else {
      dateTo.setDate(dateTo.getDate() + 7);
    }
    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');

    let teacherId = '';

    if (this.profileFacade.isStudent()) {
      teacherId = this.lessonsStore.currentUser()?.id.toString()! ?? 0;
    } else {
      teacherId = this.profile()?.id.toString()!;
    }

    setTimeout(() => {
      this.store.dispatch(RouterActions.goTo({
        path: [EAppPages.Lessons, teacherId, ELessonPages.RecordTime],
        extras: {queryParams: {
            recordType: ELessonsRecordType.Transferring,
            from,
            to,
            lessonsType: this.currentLessonsType()
          }}
      }))
    }, 0)
  }

  public exitFromCanselSuccess(): void {
    this.lessonsStore.clearAdditionalInfo();

    if (this.profileFacade.isStudent()) {
      this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student], back: true}))
      return;
    }

    const dateTo = new Date();
    dateTo.setMonth(dateTo.getMonth() + 2);
    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Users, EUserPages.ListUsers],
      extras: {queryParams: {tab: EHeaderMenu.Schedule, from, to}},
      back: true
    }))
  }

  public cancelLesson(): void {
    if (this.profileFacade.isStudent()) {
      const data: ICancelLesson = {
        teacher_id: this.lessonsStore.currentUser()?.id ?? 0,
        lesson_id: this.lessonsStore.currentLessonId()!,
      }

      if (this.currentLessonsType() === ELessonsType.TeacherGuided) {
        this.lessonsStore.canceledAsStudent(data);
      } else {
        this.lessonsStore.cancelIndividualAsStudent(data);
      }
      return;
    }

    if (this.profileFacade.isTeacher()) {
      const data: ICancelLesson = {
        student_id: this.lessonsStore.currentUser()!.id,
        lesson_id: this.lessonsStore.currentLessonId()!,
      }
      this.lessonsStore.cancelAsTeacher(data);
      return;
    }

    if (this.profileFacade.isAdmin()) {
      const data: ICancelLesson = {
        student_id: this.lessonsStore.currentUser()!.id,
        lesson_id: this.lessonsStore.currentLessonId()!,
      }
      this.lessonsStore.cancelIndividualAsAdmin(data);
      return;
    }
  }

  public getSlotsToStudent(day: string): void {
    if (this.currentLessonsType() === ELessonsType.TeacherGuided) {
      this.lessonsStore.getTeacherSlots(day);
    } else {
      this.lessonsStore.getIndividualSlots();
    }
  }

  public getStudentsForFreeLessons(search: string): void {
    this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page: 1, search}))
  }

  public closSelectedTeacher(): void {
    this.choseTeacher.set(false);

    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      this.store.dispatch(RouterActions.goTo({
        path: [EAppPages.Settings, ESettingsPages.List],
        back: true
      }))
    } else {
      this.goToStudentMain()
    }
  }

  public closeLessonsPage(): void {
    this.choseTeacher.set(false);

    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      this.store.dispatch(RouterActions.goTo({
        path: [EAppPages.Settings, ESettingsPages.List],
        back: true
      }))
    } else {
      this.goToStudentMain()
    }
  }
}