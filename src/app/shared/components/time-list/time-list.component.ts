import {Component, OnInit} from "@angular/core";
import {TimeComponent} from "@shared/components/time/time.component";
import {TIME_LIST} from "../../../features/schedule/models/schedule.model";

@Component({
  selector: "cp-time-list",
  templateUrl: "./time-list.component.html",
  styleUrls: ["./time-list.component.scss"],
  imports: [
    TimeComponent
  ]
})
export class TimeListComponent implements OnInit {
  public TIME_LIST = TIME_LIST;

  ngOnInit() {
  }
}
