import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {
  EHeaderMenu,
  EUserRole,
} from "src/app/features/users/models/user.model";
import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {IonButton, IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {
  EScheduleType,
  SCHEDULE_TYPE_TABS,
  WEEK_SHORT_LIST
} from "../../models/schedule.model";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {CalendarShortComponent} from "@shared/components/calendar-short/calendar-short.component";
import {ScheduleFacade} from "@schedule/schedule.facade";

@Component({
  selector: "cp-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [ScheduleFacade],
  imports: [
    TimeListComponent,
    IonButton,
    TranslatePipe,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    HeaderSecondaryComponent,
    CalendarComponent,
  ]
})
export class ScheduleComponent implements OnInit {
  public readonly scheduleFacade = inject(ScheduleFacade);
  public profile = computed(() => this.scheduleFacade.profile())
  public activeTab = signal(WEEK_SHORT_LIST[0])
  public scheduleType = signal(EScheduleType.Weekly)
  public WEEK_SHORT_LIST = WEEK_SHORT_LIST;
  public SCHEDULE_TYPE_TABS = SCHEDULE_TYPE_TABS();
  public eScheduleType = EScheduleType;
  public eUserRole = EUserRole;
  protected readonly eHeaderMenu = EHeaderMenu;

  ngOnInit() {
  }

  public onSegmentChange(event: CustomEvent): void {
    this.activeTab.set(event.detail.value as string)
  }

  public scheduleTypeChange(event: CustomEvent): void {
    this.scheduleType.set(event.detail.value as EScheduleType)
  }
}
