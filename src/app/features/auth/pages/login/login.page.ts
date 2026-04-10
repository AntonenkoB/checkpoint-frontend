import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthActions} from "../../store/actions";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {
  selectAuthStep,
  selectCheckUserFailure, selectForgotPasswordFailure,
  selectLoginFailure
} from "../../store/selectors";
import {EAuthStep, ISavePassword} from "../../models/auth.model";
import {IonButton, IonCheckbox, IonInput, IonInputPasswordToggle, IonItem} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {addIcons} from "ionicons";
import {NoRipplePasswordToggle} from "@shared/directives/no-ripple-password-toggle";
import {CustomCheckbox} from "@shared/directives/custom-checkbox";
import {Platform} from "@ionic/angular";
import {FORM_PASSWORD_ICONS} from "@models/form.models";
import {DomSanitizer} from "@angular/platform-browser";
import { LOGO_SVG } from '@models/svg.models';

@Component({
  selector: 'cp-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, IonInput, IonButton, IonInputPasswordToggle, IonCheckbox, TranslatePipe, IonItem, NoRipplePasswordToggle, CustomCheckbox]
})
export class LoginPage {
  private store = inject<Store<AppState>>(Store);
  public readonly platform = inject(Platform);
  public readonly sanitizer = inject(DomSanitizer);
  public name = signal('');
  public password = signal('');
  public email = signal('');
  public repeat = signal(false);
  public createPassword = signal({password: '', password_confirmation: ''});
  public authStep = this.store.selectSignal(selectAuthStep);
  public checkUserFailure = this.store.selectSignal(selectCheckUserFailure);
  public loginFailure = this.store.selectSignal(selectLoginFailure);
  public forgotPasswordFailure = this.store.selectSignal(selectForgotPasswordFailure);
  protected readonly EAuthStep = EAuthStep;
  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);

  constructor() {
    addIcons(FORM_PASSWORD_ICONS);
  }

  public changeName(name: string): void {
    if (!!this.checkUserFailure()) {
      this.store.dispatch(AuthActions.checkUserFailure({error: null}))
    }

    this.name.set(name)
  }

  public changeEmail(email: string): void {
    this.email.set(email)
  }

  public changePassword(password: string): void {
    if (!!this.loginFailure()) {
      this.store.dispatch(AuthActions.loginFailure({error: null}))
    }

    this.password.set(password)
  }

  public forgotPassword(): void {
    this.store.dispatch(AuthActions.authStep({step: EAuthStep.ForgotPassword}))
  }

  public savePassword(password: string): void {
    this.createPassword.set({password: password, password_confirmation: password})
  }

  public send(): void {
    switch (this.authStep()) {
      case EAuthStep.Identifier:
        this.store.dispatch(AuthActions.checkUser({payload: {identifier: this.name()}}))
        break
      case EAuthStep.Password:
        this.store.dispatch(AuthActions.login({
          login: {
            identifier: this.name(),
            password: this.password(),
            repeat: this.repeat(),
          }
        }))
        break
      case EAuthStep.CreatePassword:
        this.store.dispatch(AuthActions.createPassword({payload: this.createPassword() as ISavePassword}))
        break
      case EAuthStep.ForgotPassword:
        this.store.dispatch(AuthActions.forgotPassword({payload: {email: this.email()}}))
    }
  }
}
