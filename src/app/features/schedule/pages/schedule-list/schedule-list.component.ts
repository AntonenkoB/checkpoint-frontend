import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {interval} from "rxjs";
import {EUserRole} from "@models/user.model";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {ScheduleFacade} from "@schedule/facade/schedule.facade";
import {ScheduleStore} from "@schedule/store/schedule.store";
import {ScheduleListStore} from "@schedule/store/schedule-list.store";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {formatToDateTime} from "@shared/utils/date.utils";
import {DayTitlePipe} from "@shared/pipes/day-title-pipe";
import {ITimeRange} from "@schedule/models/schedule.model";
import {TranslatePluralPipe} from "@shared/pipes/translate-plural.pipe";

@Component({
  selector: "cp-schedule-list",
  templateUrl: "./schedule-list.component.html",
  styleUrls: ["./schedule-list.component.scss"],
  imports: [
    CalendarComponent,
    UserItemComponent,
    LoaderComponent,
    EmptyStateComponent,
    DayTitlePipe,
    TranslatePluralPipe
  ]
})
export class ScheduleListComponent implements OnInit {
  public readonly scheduleFacade = inject(ScheduleFacade);
  public readonly scheduleListStore = inject(ScheduleListStore);
  public readonly scheduleStore = inject(ScheduleStore);
  private readonly destroyRef = inject(DestroyRef);

  private static readonly REFRESH_INTERVAL_MS = 60_000;

  public profile = computed(() => this.scheduleFacade.profile())
  public studentsList = signal(this.scheduleFacade.studentsList());
  public eUserRole = EUserRole;

  public activeDate = signal<string>('');
  private isManualScrolling = false;

  public recordedDays = computed(() => {
    return this.scheduleStore.slotsEntities().flatMap((item) => item.date)
  })


  constructor() {
    effect(() => {
      this.studentsList.set(this.scheduleFacade.studentsList());
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.scheduleFacade.getScheduleSlots();
    }, 0)

    this.scheduleFacade.loadNotificationsCount();

    interval(ScheduleListComponent.REFRESH_INTERVAL_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshData());
  }

  private refreshData(): void {
    this.scheduleFacade.getScheduleSlots();
    this.scheduleFacade.loadNotificationsCount();
  }

  public selectDay(event: CustomEvent): void {
    const date = event.detail.value;
    const element = document.getElementById(date);

    if (element) {
      this.isManualScrolling = true;
      this.activeDate.set(date);

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setTimeout(() => (this.isManualScrolling = false), 1000);
    }
  }

  public getDayTitle(date: string, slot: ITimeRange): string {
    return formatToDateTime(date, slot.from, slot.to);
  }
}
