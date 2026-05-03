import {Component, computed, effect, signal} from "@angular/core";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";

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
        date: new Date(current).toISOString(),
        day,
        number
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  });

  public scheduleDay = signal(this.next2MonthsDays()[0].date)

  constructor() {
    effect(() => {
      this.scheduleDay.set(this.next2MonthsDays()[0].date)
    });
  }


  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public dayChange(event: CustomEvent): void {
    // this.scheduleDay.set(event.detail.value)
  }
}
