import {Component, effect, input, model, OnInit, output, signal} from "@angular/core";
import {TouchFeedbackDirective} from "@shared/directives/touch-feedback";
import {ITimeRange, TIME_LIST} from "@schedule/models/schedule.model";

@Component({
  selector: "cp-time",
  templateUrl: "./time.component.html",
  styleUrls: ["./time.component.scss"],
  imports: []
})
export class TimeComponent implements OnInit {
  public time = input<ITimeRange>();
  public isActive = model(false);
  public isDisabled = model(false);
  public hasLesson = model(false);
  public onlyOne = model(false);
  public selectTime = output<ITimeRange>()
  public unselectTime = output<ITimeRange>()

  ngOnInit() {
  }

  public clickToTime(): void {
    if (this.isDisabled() || this.hasLesson()) {
      return
    }

    this.isActive.update(v => !v);

    if (this.time()) {
      this.isActive() ?
        this.selectTime.emit(this.time()!)
        : this.unselectTime.emit(this.time()!);
    }
  }
}
