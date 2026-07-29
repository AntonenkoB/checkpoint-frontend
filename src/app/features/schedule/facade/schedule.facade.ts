import {computed, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EHeaderMenu} from "@users/models/user.model";
import {IUser} from "@models/user.model";
import { selectRouteParams } from "../../../store/router/selectors";
import {RouterActions} from "../../../store/router/actions";
import {EDayOfWeek, ESchedulePages, IScheduleItem, IScheduleItemToDate, ITimeRange} from "../models/schedule.model";
import {ScheduleStore} from "@schedule/store/schedule.store";
import {ScheduleListStore} from "@schedule/store/schedule-list.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentsStore} from "@users/store/students.store";
import {ELessonPages, ELessonsType} from "@lessons/models/lessons.model";
import {LessonsStore} from "@lessons/store/lessons.store";
import {formatToDateTime} from "@shared/utils/date.utils";
import {NotificationsStore} from "@notifacations/store/notifications.store";


@Injectable({ providedIn: 'root' })
export class ScheduleFacade {
  private store = inject<Store<AppState>>(Store);
  public scheduleStore = inject(ScheduleStore);
  public scheduleListStore = inject(ScheduleListStore);
  private studentsStore = inject(StudentsStore);
  private lessonsStore = inject(LessonsStore);
  private notificationsStore = inject(NotificationsStore);
  private profileFacade = inject(ProfileFacade);

  public readonly profile = this.profileFacade.profile;
  public readonly activeRole = this.profileFacade.activeRole;
  public readonly isAdmin = this.profileFacade.isAdmin;
  public readonly isTeacher = this.profileFacade.isTeacher;
  public selectRouteParams = this.store.selectSignal(selectRouteParams);
  public selectQueryParamFrom = computed(() => this.scheduleStore.form());
  public studentsList = this.studentsStore.studentsList;
  public notificationsCount = this.notificationsStore.notificationsCount;
  public studentTeachers = computed(() => this.profile()?.teachers ?? []);
  public readonly scheduleByDate = computed<IScheduleItemToDate[]>(() => {
    const data = this.scheduleStore.slotsEntities() ?? [];

    const groupedMap = data.reduce((acc, item) => {
      const dateKey = item.date;

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, IScheduleItem[]>);

    return Object.entries(groupedMap)
      .map(([date, slots]) => ({ date, slots }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  constructor() {
  }

  public getScheduleSetting(): void {
    if (this.profileFacade.isAdmin()) {
      this.scheduleStore.getIndividualWeekly();
      this.scheduleStore.getIndividualSlots();
    } else {
      this.scheduleStore.getWeekly();
      this.scheduleStore.getSlots();
    }
  }

  public getScheduleSlots(): void {
    if (this.profileFacade.isAdmin()) {
      this.scheduleStore.getOverviewSlots();
    } else {
      this.scheduleStore.getSlots();
    }
  }

  public loadNotificationsCount(): void {
    if (!this.activeRole()) return;

    this.notificationsStore.getNotificationCount(this.activeRole()!);
  }

  public saveWeekSlot(day: EDayOfWeek, slots: ITimeRange[] ): void {
    const data = {
      day_of_week: day,
      slots
    }

    if (this.profileFacade.isAdmin()) {
      this.scheduleStore.setIndividualWeekSlot(data);
    } else {
      this.scheduleStore.setWeekSlot(data);
    }
  }

  public deleteWeekSlot(id: string): void {
    this.scheduleStore.deleteWeekSlot(id);
  }

  public saveSlot(date: string, slots: ITimeRange[] ): void {
    const data = {
      date,
      slots
    }

    if (this.profileFacade.isAdmin()) {
      this.scheduleStore.setIndividualSlots(data);
    } else {
      this.scheduleStore.setSlots(data);
    }
  }

  public deleteSlot(id: string): void {
    this.scheduleStore.deleteSlots(id);
  }

  public selectedLessonType(type: ELessonsType): void {
    const moreOneTeacher = this.studentTeachers().length > 1;

    if (moreOneTeacher && type === ELessonsType.TeacherGuided) {
      this.goToSelectTeacher();
      return;
    }

    this.goToSelectTime();
  }

  public goToSelectTeacher(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.SelectTeacher]}))
  }

  public goToSelectTime(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.RecordTime]}))
  }

  public goToSchedule(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, ESchedulePages.List], extras: { queryParams: { tab: EHeaderMenu.Schedule }}}))
  }

  public goToRecordStudent(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.RecordStudent]}))
  }

  public goToNotifications(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Notifications]}))
  }

  public goToTransferringLesson(user: IUser, time: string, lessonId: number): void {
    const lessonsType = this.profileFacade.isAdmin() ? ELessonsType.SelfStudy : ELessonsType.TeacherGuided;
    this.lessonsStore.updateCurrentUser(user);
    this.lessonsStore.updateCurrentDateTime(time);
    this.lessonsStore.updateCurrentLessonId(lessonId);

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.LessonTransferringType],
      extras: {queryParams: {lessonsType}}
    }))
  }

  // schedule list
  public selectTime(id: number, date: string, time: ITimeRange, slotId: number): void {
    if (!id) {
      const prepareDate = formatToDateTime(date, time.from, time.to);
      this.lessonsStore.updateCurrentDateTime(prepareDate);

      this.scheduleListStore.updateCurrentTimeLocally(prepareDate);
      this.scheduleListStore.updateCurrentSlotIdLocally(slotId);

      this.goToRecordStudent()
    }
  }
}