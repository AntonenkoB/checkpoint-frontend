import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonContent, IonInput, IonItem} from '@ionic/angular/standalone';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthFacade} from '../../facade/auth.facade';
import {ISavePassword} from '../../models/auth.model';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';
import {ButtonsComponent} from "@shared/components/buttons/buttons.component";

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
    TranslatePipe,
    ButtonsComponent,
  ],
})
export class LoginResetPasswordComponent {
  public readonly authFacade = inject(AuthFacade);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly createPassword = signal<ISavePassword>({password: '', password_confirmation: ''});

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  constructor() {
  }

  public changePassword(password: string): void {
    if (this.authFacade.loginFailure()) {
      this.authFacade.clearLoginFailure();
    }

    this.createPassword.set({password, password_confirmation: password});
  }

  public goBack(): void {
    this.authFacade.backToIdentifier();
  }

  public send(): void {
    this.authFacade.resetPassword(this.createPassword().password, this.createPassword().password_confirmation);
  }
}