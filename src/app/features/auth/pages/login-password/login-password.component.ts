import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
} from '@ionic/angular/standalone';
import {Platform} from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';
import {addIcons} from 'ionicons';

import {AuthFacade} from '../../facade/auth.facade';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {NoRipplePasswordToggle} from '@shared/directives/no-ripple-password-toggle';
import {CustomCheckbox} from '@shared/directives/custom-checkbox';
import {FORM_PASSWORD_ICONS} from '@models/form.models';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';

@Component({
  selector: 'cp-login-password',
  templateUrl: './login-password.component.html',
  styleUrls: ['./login-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonCheckbox,
    IonInputPasswordToggle,
    TranslatePipe,
    NoRipplePasswordToggle,
    CustomCheckbox,
  ],
})
export class LoginPasswordComponent {
  private readonly authFacade = inject(AuthFacade);
  public readonly platform = inject(Platform);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly password = signal('');
  public readonly repeat = signal(false);
  public readonly loginFailure = this.authFacade.loginFailure;

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  constructor() {
    addIcons(FORM_PASSWORD_ICONS);
  }

  public inputPassword(password: string): void {
    if (this.loginFailure()) {
      this.authFacade.clearLoginFailure();
    }

    this.password.set(password);
  }

  public forgotPassword(): void {
    this.authFacade.goToForgotPassword();
  }

  public goBack(): void {
    this.authFacade.backToIdentifier();
  }

  public send(): void {
    this.authFacade.login({
      identifier: this.authFacade.identifier() ?? '',
      password: this.password(),
      repeat: this.repeat(),
    });
  }
}