import {Component, computed, inject, input, OnInit, output} from "@angular/core";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: "cp-calendar-short",
  templateUrl: "./calendar-short.component.html",
  styleUrls: ["./calendar-short.component.scss"],
  imports: [
    TabsComponent
  ]
})
export class CalendarShortComponent implements OnInit {
  private datePipe = inject(DatePipe);
  public activeDays = input<string[]>();
  public selectDay = output<string>();

  public nextWeek = computed(() => {
    const today = new Date();
    const numberDays = 8;

    return Array.from({ length: numberDays }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      return {
        value: this.datePipe.transform(d, 'yyyy-MM-dd') as string,
        title: d.toLocaleDateString('uk-UA', { weekday: 'long' })
      };
    });
  });

  public disabledTabs = computed(() => {
    return this.nextWeek()
      .filter(day => !this.activeDays()?.includes(day.value))
      .map(day => day.value);
  })

  ngOnInit() {}
}
