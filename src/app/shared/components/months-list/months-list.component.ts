import {Component, computed, effect, input, model, OnInit, output} from "@angular/core";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {accessibility} from "ionicons/icons";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";

@Component({
  selector: "cp-months-list",
  templateUrl: "./months-list.component.html",
  styleUrls: ["./months-list.component.scss"],
  imports: [
    TabsComponent,
  ]
})
export class MonthsListComponent implements OnInit {
  public changeMonth = output<string>()
  public MONTH_LIST = computed(() => {
    const months = [];
    const now = new Date();
    const monthsAgo = 12;

    const monthFormatter = new Intl.DateTimeFormat('uk-UA', { month: 'long' });

    for (let i = 0; i < monthsAgo; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthTitle = monthFormatter.format(date);
      const capitalizedTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      months.push({
        value: `${year}-${month}`,
        title: capitalizedTitle
      });
    }

    return months;
  });

  public activeMonth = input(this.MONTH_LIST()[0].value);

  constructor() {
  }

  ngOnInit() {}

  public onSegmentChange(month: string): void {
    this.changeMonth.emit(month);
  }
}
