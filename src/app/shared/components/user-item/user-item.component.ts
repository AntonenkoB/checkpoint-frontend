import {Component, inject, input, output} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IUser} from "../../../features/users/models/user.model";
import {DomSanitizer} from "@angular/platform-browser";
import {CHECK_THIN_SVG, CLOSE_SVG} from "@models/svg.models";

@Component({
  selector: "cp-user-item",
  templateUrl: "./user-item.component.html",
  styleUrls: ["./user-item.component.scss"],
  imports: [
    AvatarComponent,
    TranslatePipe
  ]
})
export class UserItemComponent {
  public readonly sanitizer = inject(DomSanitizer);
  public user = input<IUser>();
  public isSelect = input(false);
  public showDelete = input(false);
  public delete = output<number | undefined>();
  public CHECK_THIN_SVG = this.sanitizer.bypassSecurityTrustHtml(CHECK_THIN_SVG);
  public CLOSE_SVG = this.sanitizer.bypassSecurityTrustHtml(CLOSE_SVG);


  public getCreativeName(): string {
    return this.user()?.creative_name ?? this.user()?.first_name ?? ''
  }

  public getName(): string {
    return this.user()?.creative_name ? `${this.user()?.first_name ?? ''} ${this.user()?.last_name ?? ''}` : this.user()?.last_name ?? ''
  }
}
