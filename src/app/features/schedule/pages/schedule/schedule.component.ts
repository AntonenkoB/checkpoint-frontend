import {Component, computed, effect, inject, OnInit, signal, ViewChild} from "@angular/core";
import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {IonLabel, IonModal, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {
  EDayOfWeek,
  EScheduleStatus,
  EScheduleType, ITimeRange,
  SCHEDULE_TYPE_TABS,
  WEEK_SHORT_LIST
} from "../../models/schedule.model";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {ScheduleFacade} from "@schedule/facade/schedule.facade";
import {ScheduleStore} from "@schedule/store/schedule.store";
import {DatePipe} from "@angular/common";
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {Platform} from "@ionic/angular";
import {ButtonsComponent} from "@shared/components/buttons/buttons.component";
import {DayPagerSwipeComponent} from "@shared/components/day-pager-swipe/day-pager-swipe.component";

@Component({
  selector: "cp-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [ScheduleFacade],
  imports: [
    TimeListComponent,
    TranslatePipe,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    HeaderSecondaryComponent,
    CalendarComponent,
    ConfirmModalComponent,
    IonModal,
    ButtonsComponent,
    DayPagerSwipeComponent,
  ]
})
export class ScheduleComponent implements OnInit {
  @ViewChild('confirmChangeModal', { static: false }) confirmChangeModal!: IonModal;

  public scheduleStore = inject(ScheduleStore);
  public readonly scheduleFacade = inject(ScheduleFacade);
  private datePipe = inject(DatePipe);
  private platform = inject(Platform);

  public modalBreakpoints = this.platform.is('desktop') ? undefined : [0, 0.5];
  public initialBreakpoint = this.platform.is('desktop') ? undefined : 0.5;

  public profile = computed(() => this.scheduleFacade.profile());
  public activeDay = signal<EDayOfWeek>(WEEK_SHORT_LIST[0].value);
  public activeDate = signal(this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string);
  public scheduleType = signal(EScheduleType.OneTime);
  public weekSlotsPrepare = computed(() => this.weekSlotsFor(this.activeDay()));

  public readonly weekPagerSwipeDays = WEEK_SHORT_LIST.map((day) => String(day.value));

  public recordedDays = computed(() => {
    return this.scheduleStore.slotsEntities().flatMap((item) => item.date)
  });

  public readonly pagerSwipeDays = this.buildPagerSwipeDays();

  public daySlotsPrepare = computed(() => this.daySlotsFor(this.activeDate()));

  public daySlots = signal(this.daySlotsPrepare());

  public isDirty = computed(() => {
    if (this.scheduleType() === EScheduleType.OneTime) {
      return !this.areSlotsEqual(this.daySlots(), this.daySlotsPrepare());
    }
    return !this.areSlotsEqual(this.daySlots(), this.weekSlotsPrepare());
  });

  public WEEK_SHORT_LIST = WEEK_SHORT_LIST;
  public SCHEDULE_TYPE_TABS = SCHEDULE_TYPE_TABS();
  public eScheduleType = EScheduleType;

  constructor() {
    effect(() => {
      if (this.scheduleType() === EScheduleType.OneTime) {
        this.daySlots.set(this.daySlotsPrepare());
      }
    });
  }

  public ngOnInit() {
    // this.scheduleFacade.getScheduleSetting();
  }

  public ionViewWillEnter(): void {
    this.scheduleFacade.getScheduleSetting();
  }

  public closeSettingSchedule(): void {
    if (this.checkDirtySlots()) {
      void this.confirmChangeModal.present();
      return
    }

    this.scheduleFacade.goToSchedule()
  }

  public scheduleTypeChange(event: CustomEvent): void {
    if (this.checkDirtySlots()) {
      const element = event.target as HTMLIonSelectElement | HTMLIonSegmentElement;

      if (event.detail.value === EScheduleType.OneTime ) {
        this.scheduleType.set(EScheduleType.Weekly)
        element.value = EScheduleType.Weekly;
      } else {
        this.scheduleType.set(EScheduleType.OneTime)
        element.value = EScheduleType.OneTime;
      }

      void this.confirmChangeModal.present();
      return
    }

    this.scheduleType.set(event.detail.value as EScheduleType)

    if (this.scheduleType() === EScheduleType.OneTime) {
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;
      this.activeDate.set(date);
      this.daySlots.set(this.daySlotsPrepare());
    } else {
      this.activeDay.set(WEEK_SHORT_LIST[0].value);
      this.daySlots.set(this.weekSlotsPrepare())
    }
  }

  public selectDay(event: CustomEvent): void {
    if (this.checkDirtySlots()) {
      void this.confirmChangeModal.present();
      return
    }

    this.changeDate(event.detail.value);
  }

  public canChangeDay = (): boolean => {
    if (this.checkDirtySlots()) {
      void this.confirmChangeModal.present();
      return false;
    }
    return true;
  };

  public changeDate(date: string): void {
    this.activeDate.set(date);
    this.daySlots.set(this.daySlotsFor(date));
  }

  public selectWeekDay(event: CustomEvent): void {
    if (this.checkDirtySlots()) {
      const element = event.target as HTMLIonSelectElement | HTMLIonSegmentElement;
      this.activeDay.set(this.activeDay());
      element.value = this.activeDay();

      void this.confirmChangeModal.present();
      return
    }

    this.changeWeekDay(event.detail.value);
  }

  public changeWeekDay(day: EDayOfWeek | string): void {
    this.activeDay.set(Number(day) as EDayOfWeek);
    this.daySlots.set(this.weekSlotsFor(this.activeDay()));
  }

  public selectTime(time: ITimeRange): void {
    this.daySlots.update(slots => [
      ...slots,
      time
    ]);
  }

  public unselectTime(time: ITimeRange): void {
    this.daySlots.update(slots =>
      slots.filter(slot => slot.from !== time.from)
    );


    // if (this.scheduleType() === EScheduleType.OneTime) {
    //   const currentDay = this.scheduleStore.slotsEntities()
    //     .filter(slot => slot.date === this.activeDate())
    //
    //   const currentSlotId = currentDay.filter(slot => slot.time.from === time.from)[0].id.toString();
    //   this.scheduleFacade.deleteSlot(currentSlotId);
    //   return
    // }
    //
    // const currentDay = this.scheduleStore.weeklyEntities().filter(day => day.day_of_week === this.activeDay());
    // const currentSlotId = currentDay.filter(slot => slot.time.from === time.from)[0].id.toString();
    //
    // this.scheduleFacade.deleteWeekSlot(currentSlotId);
  }

  public canselSlotChange(): void {
    if (this.scheduleType() === EScheduleType.OneTime) {
      this.daySlots.set(this.daySlotsPrepare());
    } else {
      this.daySlots.set(this.weekSlotsPrepare());
    }

    void this.confirmChangeModal.dismiss();
  }

  public confirmSlotChange(): void {
    void this.confirmChangeModal.dismiss();
    this.save();
  }

  public save(): void {
    if (this.scheduleType() === EScheduleType.OneTime) {
      this.scheduleFacade.saveSlot(this.activeDate()!, this.daySlots())
    } else {
      this.scheduleFacade.saveWeekSlot(this.activeDay(), this.daySlots())
    }
  }

  public daySlotsFor(date: string): ITimeRange[] {
    const seen = new Set<number>();

    return this.scheduleStore.slotsEntities()
      .filter(slot => slot.date === date)
      .flatMap(item => {
        if (seen.has(item.time.from)) return [];

        seen.add(item.time.from);
        return item.time;
      });
  }

  public hasLessonsFor(date: string): ITimeRange[] {
    return this.scheduleStore.slotsEntities()
      .filter((item) => item.date === date && (!!item.lesson || item.status === EScheduleStatus.Reserved))
      .flatMap((item) => item.time);
  }

  private buildPagerSwipeDays(): string[] {
    const days: string[] = [];
    const current = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 2);

    while (current <= end) {
      days.push(this.datePipe.transform(current, 'yyyy-MM-dd') as string);
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  public weekSlotsFor(day: EDayOfWeek | string): ITimeRange[] {
    return this.scheduleStore.weeklyEntities()
      .filter(slot => slot.day_of_week === Number(day))
      .flatMap(item => item.time);
  }

  private checkDirtySlots(): boolean {
    if (this.scheduleType() === EScheduleType.OneTime) {
      return !this.areSlotsEqual(this.daySlots(), this.daySlotsPrepare());
    }

    return !this.areSlotsEqual(this.daySlots(), this.weekSlotsPrepare());
  }

  private areSlotsEqual(slotsA: ITimeRange[], slotsB: ITimeRange[]): boolean {
    if (slotsA.length !== slotsB.length) return false;

    const sortedA = [...slotsA].sort((a, b) => a.from.toString().localeCompare(b.from.toString()));
    const sortedB = [...slotsB].sort((a, b) => a.from.toString().localeCompare(b.from.toString()));

    return sortedA.every((slot, index) =>
      slot.from === sortedB[index].from
    );
  }
}
