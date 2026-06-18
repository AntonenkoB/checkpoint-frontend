import {Component, computed, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {IonButton} from "@ionic/angular/standalone";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {ELessonsRecordType, ELessonsType, ISetLesson, ITransferringLesson} from "@lessons/models/lessons.model";
import {DatePipe} from "@angular/common";
import {IScheduleItem, ITimeRange, TIME_LIST} from "@schedule/models/schedule.model";
import {formatToDateTime} from "@shared/utils/date.utils";
import {CalendarShortComponent} from "@shared/components/calendar-short/calendar-short.component";
import {RecordTimeFacade} from "@lessons/facade/record-time.facade";

@Component({
  selector: "cp-record-time",
  templateUrl: "./record-time.component.html",
  styleUrls: ["./record-time.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    RecordStudentItemComponent,
    CalendarComponent,
    TimeListComponent,
    IonButton,
    CalendarShortComponent
  ],
  providers: [RecordTimeFacade]
})
export class RecordTimeComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  private recordTimeFacade = inject(RecordTimeFacade);
  private datePipe = inject(DatePipe);
  public eLessonsType = ELessonsType;

  private activeDay = signal(this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string);

  public activeTime = signal<ITimeRange[]>([]);

  public disabledSlotsPrepare = computed(() =>
    this.recordTimeFacade.getDisabledSlotsForDay(this.activeDay())
  );

  // public disabledSlotsPrepare = computed(() => {
  //   let data = [] as IScheduleItem[];
  //
  //   if (this.lessonsFacade.profileFacade.isStudent()) {
  //     data = this.lessonsFacade.slots() ?? [];
  //   }
  //
  //   if (this.lessonsFacade.profileFacade.isTeacher() || this.lessonsFacade.profileFacade.isAdmin()) {
  //     data = this.lessonsFacade.scheduleStore.slotsEntities();
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

  public calendarActiveDays = this.recordTimeFacade.calendarActiveDays

  constructor() {
  }

  ngOnInit() {
    this.recordTimeFacade.loadSlots(this.activeDay());
    // if (this.lessonsFacade.profileFacade.isStudent()) {
    //   this.lessonsFacade.getSlotsToStudent(this.activeDay());
    // }
    //
    // if (this.lessonsFacade.profileFacade.isTeacher()) {
    //   this.lessonsFacade.scheduleStore.getSlots();
    // }
    //
    // if (this.lessonsFacade.profileFacade.isAdmin()) {
    //   this.lessonsFacade.scheduleStore.getIndividualSlots();
    // }
  }

  public selectDay(event: CustomEvent) {
    const date = event.detail.value;

    this.activeDay.set(date);
    this.activeTime.set([]);
  }

  public selectShortDay(date: string) {

    this.activeDay.set(date);
    this.activeTime.set([]);
  }

  public selectedTime(time: ITimeRange): void {
    const active = [time];
    this.activeTime.set(active);
  }

  public save(): void {
    this.recordTimeFacade.bookOrTransfer(this.activeDay(), this.activeTime());
  //   const currentSlot =
  //     this.lessonsFacade.slots()?.filter(
  //       slot => slot.date === this.activeDay()
  //     ).find((slot) => slot.time.from === this.activeTime()[0].from);
  //   const lesson_id = this.lessonsFacade.lessonsStore.currentLessonId();
  //   const currentUser = this.lessonsFacade.lessonsStore.currentUser();
  //
  //   if (this.lessonsFacade.currentRecordTab() === ELessonsRecordType.Transferring) {
  //     if (this.lessonsFacade.profileFacade.isStudent()) {
  //
  //       if (this.lessonsFacade.currentLessonsType() === ELessonsType.TeacherGuided) {
  //         const data: ITransferringLesson = {
  //           teacher_id: currentUser?.id,
  //           lesson_id: lesson_id ?? 0,
  //           slot_id: currentSlot?.id ?? 0
  //         }
  //         this.lessonsFacade.lessonsStore.transferringAsStudent(data);
  //       } else {
  //         const data: ITransferringLesson = {
  //           lesson_id: lesson_id ?? 0,
  //           slot_id: currentSlot?.id ?? 0
  //         }
  //         this.lessonsFacade.lessonsStore.transferringIndividualAsStudent(data);
  //       }
  //     }
  //
  //     if (this.lessonsFacade.profileFacade.isTeacher()) {
  //       const currentSlotForTeacher =
  //         this.lessonsFacade.scheduleStore.slotsEntities()?.filter(
  //           slot => slot.date === this.activeDay()
  //         ).find((slot) => slot.time.from === this.activeTime()[0].from);
  //
  //       const data: ITransferringLesson = {
  //         student_id: currentUser?.id,
  //         lesson_id: lesson_id ?? 0,
  //         slot_id: currentSlotForTeacher?.id ?? 0
  //       }
  //       this.lessonsFacade.lessonsStore.transferringAsTeacher(data);
  //     }
  //
  //
  //     if (this.lessonsFacade.profileFacade.isAdmin()) {
  //       const currentSlotForTeacher =
  //         this.lessonsFacade.scheduleStore.slotsEntities()?.filter(
  //           slot => slot.date === this.activeDay()
  //         ).find((slot) => slot.time.from === this.activeTime()[0].from);
  //
  //       const data: ITransferringLesson = {
  //         student_id: currentUser?.id,
  //         lesson_id: lesson_id ?? 0,
  //         slot_id: currentSlotForTeacher?.id ?? 0
  //       }
  //       this.lessonsFacade.lessonsStore.transferringIndividualAsAdmin(data);
  //     }
  //
  //     return
  //   }
  //
  //   const prepareDate = formatToDateTime(this.activeDay(), this.activeTime()[0].from, this.activeTime()[0].to)
  //   this.lessonsFacade.lessonsStore.updateCurrentDateTime(prepareDate);
  //
  //   if (this.lessonsFacade.currentLessonsType() === ELessonsType.TeacherGuided) {
  //     const data: ISetLesson = {
  //       teacher_id: currentUser?.id,
  //       slot_id: currentSlot?.id ?? 0
  //     }
  //
  //     this.lessonsFacade.lessonsStore.bookAsStudent(data);
  //   } else {
  //     this.lessonsFacade.lessonsStore.bookIndividualAsStudent(currentSlot?.id!);
  //   }
  }
}
