import {Component, inject} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {EMPTY_STATE_SVG} from "@models/svg.models";

@Component({
  selector: 'cp-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  public readonly sanitizer = inject(DomSanitizer);
  public EMPTY_STATE_SVG = this.sanitizer.bypassSecurityTrustHtml(EMPTY_STATE_SVG);
}
