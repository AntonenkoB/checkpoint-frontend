import {Component, computed, effect, inject, input, OnInit, Signal, signal, ViewChild} from "@angular/core";
import {EHeaderMenu} from "src/app/features/users/models/user.model";
import {IUser, EUserRole} from "@models/user.model";

import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {IonButton, IonLabel, IonModal, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {
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
    IonButton,
    ConfirmModalComponent,
    IonModal,
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
  public activeDay = signal(WEEK_SHORT_LIST[0].value);
  public activeDate = signal(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  public scheduleType = signal(EScheduleType.OneTime);
  public weekSlotsPrepare = computed(() => {
    const entities = this.scheduleStore.weeklyEntities();

    return entities
      .filter(slot => slot.day_of_week === this.activeDay())
      .flatMap(item => item.time);
  });
  public recordedDays = computed(() => {
    return this.scheduleStore.slotsEntities().flatMap((item) => item.date)
  })

  public hasLessonsTime = computed(() => {
    const lessons = this.scheduleStore.slotsEntities().filter((item) => item.date === this.activeDate() && !!item.lesson)
    return lessons.flatMap((item) => item.time)
  })

  public daySlotsPrepare = computed(() => {
    const entities = this.scheduleStore.slotsEntities();

    return entities
      .filter(slot => slot.date === this.activeDate())
      .flatMap(item => item.time);
  });

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
  public eUserRole = EUserRole;
  protected readonly eHeaderMenu = EHeaderMenu;

  constructor() {
    effect(() => {
      if (this.scheduleType() === EScheduleType.OneTime) {
        this.daySlots.set(this.daySlotsPrepare());
      }
    });
  }

  ngOnInit() {
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
      // const element = event.target as HTMLIonSelectElement | HTMLIonSegmentElement;
      // element.value = this.activeDate();
      // this.activeDate.set(this.activeDate());

      void this.confirmChangeModal.present();
      return
    }

    const date = event.detail.value;

    this.activeDate.set(date);
    const entities = this.scheduleStore.slotsEntities();

    const data = entities
      .filter(slot => slot.date === this.activeDate())
      .flatMap(item => item.time);

    this.daySlots.set(data);
  }

  public selectWeekDay(event: CustomEvent): void {
    if (this.checkDirtySlots()) {
      const element = event.target as HTMLIonSelectElement | HTMLIonSegmentElement;
      this.activeDay.set(this.activeDay());
      element.value = this.activeDay();

      void this.confirmChangeModal.present();
      return
    }

    this.activeDay.set(event.detail.value);
    this.prepareWeekDay();
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

  private prepareWeekDay(): void {
    const entities = this.scheduleStore.weeklyEntities();
    const slots = entities
      .filter(slot => slot.day_of_week === this.activeDay())
      .flatMap(item => item.time);

    this.daySlots.set(slots);
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
