import {Component, computed, effect, inject, OnInit, signal, untracked} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {ELessonsType} from "@lessons/models/lessons.model";
import {DatePipe} from "@angular/common";
import {ITimeRange} from "@schedule/models/schedule.model";
import {CalendarShortComponent} from "@shared/components/calendar-short/calendar-short.component";
import {RecordTimeFacade} from "@lessons/facade/record-time.facade";
import {ButtonsComponent} from "@shared/components/buttons/buttons.component";
import {DayPagerSwipeComponent} from "@shared/components/day-pager-swipe/day-pager-swipe.component";

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
    CalendarShortComponent,
    ButtonsComponent,
    DayPagerSwipeComponent
  ],
  providers: [RecordTimeFacade]
})
export class RecordTimeComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  public recordTimeFacade = inject(RecordTimeFacade);
  private datePipe = inject(DatePipe);

  public activeDay = signal(this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string);

  public activeTime = signal<ITimeRange[]>([]);

  public isFullCalendar = computed(() =>
    this.lessonsFacade.profileFacade.isStudent() &&
    this.lessonsFacade.currentLessonsType() === ELessonsType.TeacherGuided
  );

  public pagerSwipeDays = computed(() => {
    const today = new Date();
    const last = new Date(today);

    if (this.isFullCalendar()) {
      last.setMonth(last.getMonth() + 2);   // як у cp-calendar
    } else {
      last.setDate(last.getDate() + 7);     // 8 днів, як у cp-calendar-short
    }

    const from = this.datePipe.transform(today, 'yyyy-MM-dd') as string;
    const to = this.datePipe.transform(last, 'yyyy-MM-dd') as string;

    const days = (this.calendarActiveDays() ?? []).filter((day) => day >= from && day <= to);

    return [...new Set(days)].sort();
  });

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
    effect(() => {
      const firstDay = this.pagerSwipeDays()[0];

      if (firstDay) {
        untracked(() => this.changeDay(firstDay));
      }
    });
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
    this.changeDay(event.detail.value);
  }

  public selectShortDay(date: string) {
    this.changeDay(date);
  }

  public changeDay(date: string): void {
    if (date === this.activeDay()) {
      return;
    }
    this.activeDay.set(date);
    this.activeTime.set([]);
  }

  public selectedTime(time: ITimeRange): void {
    const active = [time];
    this.activeTime.set(active);
  }

  public save(): void {
    this.recordTimeFacade.bookOrTransfer(this.activeDay(), this.activeTime());
  }
}
