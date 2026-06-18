import {computed, effect, inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {ELessonFlow, ELessonPages, ELessonsType} from "@lessons/models/lessons.model";
import {EMarketPages} from "@market/models/market.model";
import {AppState} from "@capacitor/app";
import {RouterActions} from "../../../store/router/actions";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentStore} from "@student/store/student.store";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {ILesson} from "@models/lesson.model";
import {IUser} from "@models/user.model";
import {formatLessonToDateTime} from "@shared/utils/date.utils";

@Injectable()
export class StudentFacade {
  private store = inject<Store<AppState>>(Store);
  private profileFacade = inject(ProfileFacade);
  private lessonsFacade = inject(LessonsFacade);
  private studentStore = inject(StudentStore);
  public readonly profile = this.profileFacade.profile;
  public lessonsList = this.studentStore.lessons;
  public groupFutureLessons = this.studentStore.groupedFutureLessons;
  public groupPastLessons = this.studentStore.groupedPastLessons;
  public historyPurchases = this.studentStore.purchases

  public amountTeacherLessons = computed(() => {
    const purchases = this.profile()?.purchases ?? [];

    return purchases
      .filter(item => !!item.teacher)
      .reduce((total, item) => total + (item.lessons_remaining ?? 0), 0);
  });

  public amountIndividualLessons = computed(() => {
    const purchases = this.profile()?.purchases ?? [];

    return purchases
      .filter(item => !item.teacher)
      .reduce((total, item) => total + (item.lessons_remaining ?? 0), 0);
  });

  constructor() {
  }

  public goToProfile(back = false): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Profile], back}));
  }

  public goToLessonsType(teacherId: number): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.PaymentType, teacherId]}))
  }

  public planingLesson(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.LessonType],
      extras: {queryParams: {lessonsFlow: ELessonFlow.Booking}}
    }));
  }

  public goToSelectPaymentType(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.LessonType],
      extras: {queryParams: {lessonsFlow: ELessonFlow.Purchase}}
    }));
  }

  public goToTransferringLessonType(user: IUser, lesson: ILesson): void {
    const time = formatLessonToDateTime(lesson);
    const lessonsType = user ? ELessonsType.TeacherGuided : ELessonsType.SelfStudy;
    this.lessonsFacade.lessonsStore.updateCurrentUser(user);
    this.lessonsFacade.lessonsStore.updateCurrentDateTime(time);
    this.lessonsFacade.lessonsStore.updateCurrentLessonId(lesson.id);

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.LessonTransferringType],
      extras: {queryParams: {lessonsType}}
    }));
  }

  public getLessons(): void {
    this.studentStore.getLessons();
  }

  public loadTeachers(): void {
    this.studentStore.getTeachers();
  }

  public loadPurchases(): void {
    this.studentStore.getPurchases();
  }
}