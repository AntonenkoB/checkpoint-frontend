import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  IonCheckbox,
  IonContent,
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import {Platform} from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthFacade} from '../../facade/auth.facade';
import {ISavePassword} from '../../models/auth.model';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {CustomCheckbox} from '@shared/directives/custom-checkbox';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';
import {ButtonsComponent} from "@shared/components/buttons/buttons.component";

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
    IonCheckbox,
    TranslatePipe,
    CustomCheckbox,
    ButtonsComponent,
  ],
})
export class LoginCreatePasswordComponent {
  public readonly authFacade = inject(AuthFacade);
  public readonly platform = inject(Platform);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly createPassword = signal<ISavePassword>({password: '', password_confirmation: ''});
  public readonly repeat = signal(false);

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  constructor() {}

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
    this.authFacade.createPassword(this.createPassword(), this.repeat());
  }
}
