import {Component, computed, inject, input, output, signal} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {EUserRole, IUser} from "../../../features/users/models/user.model";
import {DomSanitizer} from "@angular/platform-browser";
import {ARROW_SVG, CHECK_THIN_SVG, CLOSE_SVG, DOTS_SVG} from "@models/svg.models";

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
  public user = input<IUser | null>();
  public isSelect = input(false);
  public showDelete = input(false);
  public timeLesson = input<string>('');
  public hideAllActions = input(false);
  public withAdditionalInfo = input(false);
  public withRatesInfo = input(false);
  public withSalaryInfo = input(false);
  public openUser = output<number | undefined>();
  public delete = output<number | undefined>();
  public dotsEvent = output<number | undefined>();
  public additionalInfoOpen = output<boolean>();
  public additionalInfoToggle = signal(false);

  public CHECK_THIN_SVG = this.sanitizer.bypassSecurityTrustHtml(CHECK_THIN_SVG);
  public CLOSE_SVG = this.sanitizer.bypassSecurityTrustHtml(CLOSE_SVG);
  public ARROW_SVG = this.sanitizer.bypassSecurityTrustHtml(ARROW_SVG);
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  protected EUserRole = EUserRole;

  public creativeName  = computed(() => this.user()?.creative_name ?? this.user()?.first_name ?? '');
  public fullName  = computed(() => this.user()?.creative_name ? `${this.user()?.first_name ?? ''} ${this.user()?.last_name ?? ''}` : this.user()?.last_name ?? '');
}
