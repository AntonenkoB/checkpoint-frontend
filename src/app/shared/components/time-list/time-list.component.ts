import {Component, input, model, OnInit, output} from "@angular/core";
import {TimeComponent} from "@shared/components/time/time.component";
import {ITimeRange, TIME_LIST} from "../../../features/schedule/models/schedule.model";

@Component({
  selector: "cp-time-list",
  templateUrl: "./time-list.component.html",
  styleUrls: ["./time-list.component.scss"],
  imports: [
    TimeComponent
  ]
})
export class TimeListComponent implements OnInit {
  public activeSlots = model<ITimeRange[]>()
  public hasLessons = input<ITimeRange[]>()
  public disabledSlots = input<ITimeRange[]>()
  public onlyOne = input<boolean>()
  public selectTime = output<ITimeRange>()
  public unselectTime = output<ITimeRange>()

  public TIME_LIST = TIME_LIST;

  constructor() {
  }

  ngOnInit() {
  }
}
