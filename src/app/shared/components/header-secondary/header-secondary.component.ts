import {Component, input, output} from "@angular/core";
import {CloseComponent} from "@shared/components/close/close.component";

@Component({
  selector: "cp-header-secondary",
  templateUrl: "./header-secondary.component.html",
  styleUrls: ["./header-secondary.component.scss"],
  imports: [
    CloseComponent
  ]
})
export class HeaderSecondaryComponent {
  public title = input('')
  public close = output()
}
