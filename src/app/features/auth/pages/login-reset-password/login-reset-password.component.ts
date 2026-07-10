import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonInput, IonInputPasswordToggle, IonItem} from '@ionic/angular/standalone';
import {DomSanitizer} from '@angular/platform-browser';
import {addIcons} from 'ionicons';

import {AuthFacade} from '../../facade/auth.facade';
import {ISavePassword} from '../../models/auth.model';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {NoRipplePasswordToggle} from '@shared/directives/no-ripple-password-toggle';
import {FORM_PASSWORD_ICONS} from '@models/form.models';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';

@Component({
  selector: 'cp-login-reset-password',
  templateUrl: './login-reset-password.component.html',
  styleUrls: ['./login-reset-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonInputPasswordToggle,
    TranslatePipe,
    NoRipplePasswordToggle,
  ],
})
export class LoginResetPasswordComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly createPassword = signal<ISavePassword>({password: '', password_confirmation: ''});
  public readonly validateCreatePassword = signal(false);

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  constructor() {
    addIcons(FORM_PASSWORD_ICONS);
  }

  public changePassword(password: string): void {
    if (this.validateCreatePassword()) {
      this.validateCreatePassword.set(false);
    }

    this.createPassword.set({password, password_confirmation: password});
  }

  public checkValidatePassword(password: string): void {
    setTimeout(() => {
      this.validateCreatePassword.set(password.length < 8);
    }, 0);
  }

  public goBack(): void {
    this.authFacade.backToIdentifier();
  }

  public send(): void {
    this.checkValidatePassword(this.createPassword().password);
    this.authFacade.resetPassword(this.createPassword().password, this.createPassword().password_confirmation);
  }
}