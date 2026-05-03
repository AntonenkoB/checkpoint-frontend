import {Component, computed, OnInit} from "@angular/core";
import {TabsComponent} from "@shared/components/tabs/tabs.component";

@Component({
  selector: "cp-calendar-short",
  templateUrl: "./calendar-short.component.html",
  styleUrls: ["./calendar-short.component.scss"],
  imports: [
    TabsComponent
  ]
})
export class CalendarShortComponent implements OnInit {
  public next3Days = computed(() => {
    const today = new Date();
    const numberDays = 3;

    const result: {
      value: string;
      title: string;
    }[] = [];

    Array.from({ length: numberDays }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        value: d.toISOString(),
        title: d.toLocaleDateString('uk-UA', {
          weekday: 'long'
        })
      })
    });

    return  result;
  });

  ngOnInit() {}
}
