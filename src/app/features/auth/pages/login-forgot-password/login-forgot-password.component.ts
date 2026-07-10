import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonInput, IonItem} from '@ionic/angular/standalone';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthFacade} from '../../facade/auth.facade';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';

@Component({
  selector: 'cp-login-forgot-password',
  templateUrl: './login-forgot-password.component.html',
  styleUrls: ['./login-forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonItem, IonInput, IonButton, TranslatePipe],
})
export class LoginForgotPasswordComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly email = signal('');
  public readonly forgotPasswordFailure = this.authFacade.forgotPasswordFailure;

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  public changeEmail(email: string): void {
    if (this.forgotPasswordFailure()) {
      this.authFacade.clearForgotPasswordFailure();
    }

    this.email.set(email);
  }

  public goBack(): void {
    this.authFacade.backToPassword();
  }

  public send(): void {
    this.authFacade.forgotPassword(this.email());
  }
}