import {computed, inject, Injectable, signal} from "@angular/core";
import {DatePipe} from "@angular/common";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {IScheduleItem, ITimeRange, TIME_LIST} from "@schedule/models/schedule.model";
import {ELessonsRecordType, ELessonsType, ISetLesson, ITransferringLesson} from "@lessons/models/lessons.model";
import {formatToDateTime, getSlotStart} from "@shared/utils/date.utils";
import {LessonsStore} from "@lessons/store/lessons.store";
import {ScheduleStore} from "@schedule/store/schedule.store";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {logoFirebase, logoHackernews} from "ionicons/icons";
import {EPurchaseStatus} from "@rates/models/rates.model";
import {
  DEADLINE_HOURS_BOOKING_INDIVIDUAL_FOR_STUDENT,
  DEADLINE_HOURS_BOOKING_LESSON_FOR_STUDENT
} from "@models/common.model";


@Injectable()
export class RecordTimeFacade {
  private datePipe = inject(DatePipe);
  private lessonsFacade = inject(LessonsFacade);
  private lessonsStore = inject(LessonsStore);
  private scheduleStore = inject(ScheduleStore);
  private profileFacade = inject(ProfileFacade);
  private route = inject(ActivatedRoute);

  private queryParams = toSignal(this.route.queryParams);
  public currentLessonsType = computed(() => this.queryParams()?.['lessonsType']);

  public isLoading = this.lessonsStore.isLoading;
  // public disabledSlotsPrepare = computed(() => {
  //   let data = [] as IScheduleItem[];
  //
  //   if (this.profileFacade.isStudent()) {
  //     data = this.lessonsFacade.slots() ?? [];
  //   }
  //
  //   if (this.profileFacade.isTeacher() || this.profileFacade.isAdmin()) {
  //     data = this.scheduleStore.slotsEntities();
  //   }
  //
  //   const freeSlots = data?.filter(
  //     (item) => !item.lesson && item.date === this.activeDay()
  //   ).map((item) => item.time) ?? [];
  //
  //   const disableTimes = TIME_LIST.filter(slot =>
  //     freeSlots.some(s => s.from === slot.from && s.to === slot.to)
  //   );
  //   return disableTimes
  // })


  public calendarActiveDays = computed(() => {
    let schedule = [] as IScheduleItem[];

    if (this.profileFacade.isStudent()) {
      schedule = this.lessonsFacade.slots() ?? [];

      if (this.currentLessonsType() === ELessonsType.TeacherGuided) {
        schedule = schedule.filter((slot) => slot.rooms_free > 0);

        const minStartTime = Date.now() + DEADLINE_HOURS_BOOKING_LESSON_FOR_STUDENT * 60 * 60 * 1000;

        schedule = schedule.filter(
          (slot) => getSlotStart(slot.date, slot.time.from).getTime() >= minStartTime,
        );

        // current payment only to last day
        // const currentPurchase = this.profileFacade.profile()?.purchases?.filter(
        //   (purchase) => purchase.teacher?.id === this.lessonsStore.currentUser()?.id && purchase.status === EPurchaseStatus.Active
        // ).sort((a, b) => a.purchased_at.localeCompare(b.purchased_at))[0];
        // if (currentPurchase) {
        //   schedule = schedule.filter((day) => day.date <= currentPurchase.expires_at);
        // }
      } else {
        const minStartTime = Date.now() + DEADLINE_HOURS_BOOKING_INDIVIDUAL_FOR_STUDENT * 60 * 60 * 1000;

        schedule = schedule.filter(
          (slot) => getSlotStart(slot.date, slot.time.from).getTime() >= minStartTime,
        );
      }
    }

    if (this.profileFacade.isTeacher() || this.profileFacade.isAdmin()) {
      schedule = this.scheduleStore.slotsEntities();
    }

    return schedule?.filter(slot => !slot.lesson)
      .flatMap(item => item.date);
  })

  constructor() {
  }

  public loadSlots(activeDay: string): void {
    if (this.profileFacade.isStudent()) {
      this.lessonsFacade.getSlotsToStudent(activeDay);
    }

    if (this.profileFacade.isTeacher()) {
      this.scheduleStore.getSlots();
    }

    if (this.lessonsFacade.profileFacade.isAdmin()) {
      this.scheduleStore.getIndividualSlots();
    }
  }

  public getDisabledSlotsForDay(activeDay: string): ITimeRange[] {
    let data = [] as IScheduleItem[];

    if (this.profileFacade.isStudent()) {
      data = this.lessonsFacade.slots() ?? [];

      if (this.currentLessonsType() === ELessonsType.TeacherGuided) {
        data = data.filter((slot) => slot.rooms_free > 0);

        const minStartTime = Date.now() + DEADLINE_HOURS_BOOKING_LESSON_FOR_STUDENT * 60 * 60 * 1000;

        data = data.filter(
          (slot) => getSlotStart(slot.date, slot.time.from).getTime() >= minStartTime,
        );

        // current payment only to last day
        // const currentPurchase = this.profileFacade.profile()?.purchases?.filter(
        //   (purchase) => purchase.teacher?.id === this.lessonsStore.currentUser()?.id && purchase.status === EPurchaseStatus.Active
        // ).sort((a, b) => a.purchased_at.localeCompare(b.purchased_at))[0];
        //
        // if (currentPurchase) {
        //   data = data.filter((slot) => slot.date <= currentPurchase.expires_at);
        // }
      } else {
        // current payment only to last day
        // const currentPurchase = this.profileFacade.profile()?.purchases?.filter(
        //   (purchase) => !purchase.teacher && purchase.status === EPurchaseStatus.Active
        // ).sort((a, b) => a.purchased_at.localeCompare(b.purchased_at))[0];
        //
        // if (currentPurchase) {
        //   data = data.filter((slot) => slot.date <= currentPurchase.expires_at);
        // }

        const minStartTime = Date.now() + DEADLINE_HOURS_BOOKING_INDIVIDUAL_FOR_STUDENT * 60 * 60 * 1000;

        data = data.filter(
          (slot) => getSlotStart(slot.date, slot.time.from).getTime() >= minStartTime,
        );
      }
    }

    if (this.profileFacade.isTeacher() || this.profileFacade.isAdmin()) {
      data = this.scheduleStore.slotsEntities();
    }

    const freeSlots = data?.filter(
      (item) => !item.lesson && item.date === activeDay
    ).map((item) => item.time) ?? [];

    return TIME_LIST.filter(slot =>
      freeSlots.some(s => s.from === slot.from && s.to === slot.to)
    );
  }

  public bookOrTransfer(activeDay: string, activeTime: ITimeRange[]): void {
    const currentSlot =
      this.lessonsFacade.slots()?.filter(
        slot => slot.date === activeDay
      ).find((slot) => slot.time.from === activeTime[0].from);
    const lesson_id = this.lessonsStore.currentLessonId();
    const currentUser = this.lessonsStore.currentUser();

    if (this.lessonsFacade.currentRecordTab() === ELessonsRecordType.Transferring) {
      if (this.profileFacade.isStudent()) {

        if (this.lessonsFacade.currentLessonsType() === ELessonsType.TeacherGuided) {
          const data: ITransferringLesson = {
            teacher_id: currentUser?.id,
            lesson_id: lesson_id ?? 0,
            slot_id: currentSlot?.id ?? 0
          }
          this.lessonsStore.transferringAsStudent(data);
        } else {
          const data: ITransferringLesson = {
            lesson_id: lesson_id ?? 0,
            slot_id: currentSlot?.id ?? 0
          }
          this.lessonsStore.transferringIndividualAsStudent(data);
        }
      }

      if (this.profileFacade.isTeacher()) {
        const currentSlotForTeacher =
          this.scheduleStore.slotsEntities()?.filter(
            slot => slot.date === activeDay
          ).find((slot) => slot.time.from === activeTime[0].from);

        const data: ITransferringLesson = {
          student_id: currentUser?.id,
          lesson_id: lesson_id ?? 0,
          slot_id: currentSlotForTeacher?.id ?? 0
        }
        this.lessonsStore.transferringAsTeacher(data);
      }


      if (this.profileFacade.isAdmin()) {
        const currentSlotForTeacher =
          this.scheduleStore.slotsEntities()?.filter(
            slot => slot.date === activeDay
          ).find((slot) => slot.time.from === activeTime[0].from);

        const data: ITransferringLesson = {
          student_id: currentUser?.id,
          lesson_id: lesson_id ?? 0,
          slot_id: currentSlotForTeacher?.id ?? 0
        }
        this.lessonsStore.transferringIndividualAsAdmin(data);
      }

      return
    }

    const prepareDate = formatToDateTime(activeDay, activeTime[0].from, activeTime[0].to)
    this.lessonsStore.updateCurrentDateTime(prepareDate);

    if (this.lessonsFacade.currentLessonsType() === ELessonsType.TeacherGuided) {
      const data: ISetLesson = {
        teacher_id: currentUser?.id,
        slot_id: currentSlot?.id ?? 0
      }

      this.lessonsStore.bookAsStudent(data);
    } else {
      this.lessonsStore.bookIndividualAsStudent(currentSlot?.id!);
    }
  }
}