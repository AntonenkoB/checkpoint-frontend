import {Component, inject, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import { EMPTY_AVATAR_SVG } from '@models/svg.models';

@Component({
  selector: 'cp-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  imports: [
    NgOptimizedImage
  ]
})
export class AvatarComponent {
  public src = input('');
  public readonly sanitizer = inject(DomSanitizer);
  public EMPTY_AVATAR_SVG = this.sanitizer.bypassSecurityTrustHtml(EMPTY_AVATAR_SVG);
}
