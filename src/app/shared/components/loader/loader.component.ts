import {Component, input} from "@angular/core";
import {IonSpinner} from "@ionic/angular/standalone";

@Component({
  selector: "cp-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  imports: [
    IonSpinner
  ],
})
export class LoaderComponent {
  public isLoad = input(false);
}
