import {Component, computed, inject, input, output, signal} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {DomSanitizer} from "@angular/platform-browser";
import {ARROW_SVG, CHECK_THIN_SVG, CLOSE_SVG, DOTS_SVG} from "@models/svg.models";
import {ITimeRange} from "@schedule/models/schedule.model";
import {IUser, EUserRole} from "@models/user.model";
import {DatePipe} from "@angular/common";
import {TranslatePluralPipe} from "@shared/pipes/translate-plural.pipe";

@Component({
  selector: "cp-user-item",
  templateUrl: "./user-item.component.html",
  styleUrls: ["./user-item.component.scss"],
  imports: [
    AvatarComponent,
    TranslatePipe,
    DatePipe,
    TranslatePluralPipe
  ]
})
export class UserItemComponent {
  public readonly sanitizer = inject(DomSanitizer);
  public user = input<IUser | null>();
  public showTeacher = input<boolean>(false);
  public withTeacher = input<IUser | null>();
  public isSelect = input(false);
  public showDelete = input(false);
  public timeLesson = input<ITimeRange>();
  public hideAllActions = input(false);
  public withAdditionalInfo = input(true);
  public disabled = input(false);
  public withSalaryInfo = input(false);
  public openUser = output<number>();
  public delete = output<number | undefined>();
  public dotsEvent = output<number | undefined>();
  public additionalInfoOpen = output<boolean>();
  public additionalInfoToggle = signal(true);

  public CHECK_THIN_SVG = this.sanitizer.bypassSecurityTrustHtml(CHECK_THIN_SVG);
  public CLOSE_SVG = this.sanitizer.bypassSecurityTrustHtml(CLOSE_SVG);
  public ARROW_SVG = this.sanitizer.bypassSecurityTrustHtml(ARROW_SVG);
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  protected EUserRole = EUserRole;

  public creativeName  = computed(() => this.user()?.creative_name ?? this.user()?.first_name ?? '');
  public fullName  = computed(() => this.user()?.creative_name ? `${this.user()?.first_name ?? ''} ${this.user()?.last_name ?? ''}` : this.user()?.last_name ?? '');

  constructor() {
  }
}
