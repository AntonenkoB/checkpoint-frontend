import {Component, inject, output} from "@angular/core";
import {IonImg} from "@ionic/angular/standalone";
import {CLOSE_SVG} from "@models/svg.models";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "cp-close",
  templateUrl: "./close.component.html",
  styleUrls: ["./close.component.scss"],
})
export class CloseComponent {
  public readonly sanitizer = inject(DomSanitizer);

  public close = output();
  public CLOSE_SVG = this.sanitizer.bypassSecurityTrustHtml(CLOSE_SVG);
}
