import {Component, inject, input, output} from "@angular/core";
import {CloseComponent} from "@shared/components/close/close.component";
import {DomSanitizer} from "@angular/platform-browser";
import {BACK_SVG} from "@models/svg.models";

@Component({
  selector: "cp-header-secondary",
  templateUrl: "./header-secondary.component.html",
  styleUrls: ["./header-secondary.component.scss"],
  imports: [
    CloseComponent
  ]
})
export class HeaderSecondaryComponent {
  public title = input('');
  public isBack = input(false);
  public close = output();
  public back = output();
  public readonly sanitizer = inject(DomSanitizer);
  public BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);
}
