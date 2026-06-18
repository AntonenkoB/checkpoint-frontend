import {Component, computed, effect, inject, input, model, OnInit, output, signal} from "@angular/core";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {DatePipe} from "@angular/common";

@Component({
  selector: "cp-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  imports: [
    IonLabel,
    IonSegment,
    IonSegmentButton
  ]
})
export class CalendarComponent {
  public activeDays = input<string[]>()
  public selectedDay = model<string>()
  public disableEmpty = input(false)
  public isDirty = input(false)
  public scheduleDay = model<string>();
  public selectDay = output<CustomEvent>();
  private datePipe = inject(DatePipe);

  public next2MonthsDays = computed(() => {
    const today = new Date();
    const end = new Date(today);
    const numberMonth = 2;
    end.setMonth(today.getMonth() + numberMonth);

    const result: {
      date: string;
      day: string;
      number: string;
    }[] = [];

    const current = new Date(today);

    while (current <= end) {
      const weekday = current.toLocaleDateString('uk-UA', {
        weekday: 'short'
      });

      const day = this.capitalize(weekday);
      const number = current.getDate().toString();

      result.push({
        date: this.datePipe.transform(current, 'yyyy-MM-dd') as string,
        day,
        number
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  });

  constructor() {
    effect(() => {
      if (!this.scheduleDay()) {
        this.scheduleDay.set(this.next2MonthsDays()[0].date)
      }
    });
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public dayChange(event: CustomEvent): void {
    if (this.isDirty()) {
      const element = event.target as HTMLIonSegmentElement;
      const currentDay = this.scheduleDay();

      setTimeout(() => {
        element.value = currentDay;
      }, 0);

      this.selectDay.emit(event);
      return
    }

    this.scheduleDay.set(event.detail.value)
    this.selectDay.emit(event);
  }
}
