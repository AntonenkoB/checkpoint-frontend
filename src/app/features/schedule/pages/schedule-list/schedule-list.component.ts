import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {EUserRole} from "../../../users/models/user.model";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {CalendarShortComponent} from "@shared/components/calendar-short/calendar-short.component";
import {ScheduleFacade} from "@schedule/schedule.facade";

@Component({
  selector: "cp-schedule-list",
  templateUrl: "./schedule-list.component.html",
  styleUrls: ["./schedule-list.component.scss"],
  providers: [ScheduleFacade],
  imports: [
    CalendarComponent,
    UserItemComponent,
    CalendarShortComponent
  ]
})
export class ScheduleListComponent implements OnInit {
  public readonly scheduleFacade = inject(ScheduleFacade);
  public profile = computed(() => this.scheduleFacade.profile())
  public studentsList = signal(this.scheduleFacade.studentsList());
  public eUserRole = EUserRole;

  constructor() {
    effect(() => {
      this.studentsList.set(this.scheduleFacade.studentsList());
    });
  }

  ngOnInit() {}
}
