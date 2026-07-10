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
import {ISavePassword} from '../../models/auth.model';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {NoRipplePasswordToggle} from '@shared/directives/no-ripple-password-toggle';
import {CustomCheckbox} from '@shared/directives/custom-checkbox';
import {FORM_PASSWORD_ICONS} from '@models/form.models';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';

@Component({
  selector: 'cp-login-create-password',
  templateUrl: './login-create-password.component.html',
  styleUrls: ['./login-create-password.component.scss'],
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
export class LoginCreatePasswordComponent {
  private readonly authFacade = inject(AuthFacade);
  public readonly platform = inject(Platform);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly createPassword = signal<ISavePassword>({password: '', password_confirmation: ''});
  public readonly repeat = signal(false);
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
    this.authFacade.createPassword(this.createPassword(), this.repeat());
  }
}
