import {Component, input, OnInit, signal} from "@angular/core";

@Component({
  selector: "cp-time",
  templateUrl: "./time.component.html",
  styleUrls: ["./time.component.scss"],
})
export class TimeComponent implements OnInit {
  public time = input();
  public active = signal(false);

  ngOnInit() {}
}
