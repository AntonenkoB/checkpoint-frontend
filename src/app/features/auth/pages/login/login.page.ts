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
import {EAuthStep, IResetPassword, ISavePassword} from "../../models/auth.model";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonInputOtp,
  IonInputPasswordToggle,
  IonItem
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {addIcons} from "ionicons";
import {NoRipplePasswordToggle} from "@shared/directives/no-ripple-password-toggle";
import {CustomCheckbox} from "@shared/directives/custom-checkbox";
import {Platform} from "@ionic/angular";
import {ToastController} from "@ionic/angular/standalone";
import {FORM_PASSWORD_ICONS} from "@models/form.models";
import {DomSanitizer} from "@angular/platform-browser";
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';
import {Subject, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'cp-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, IonInput, IonButton, IonInputPasswordToggle, IonCheckbox, TranslatePipe, IonItem, NoRipplePasswordToggle, CustomCheckbox, IonContent, IonInputOtp]
})
export class LoginPage {
  private store = inject<Store<AppState>>(Store);
  public readonly platform = inject(Platform);
  public readonly sanitizer = inject(DomSanitizer);
  private toastController = inject(ToastController);
  public name = signal('');
  public password = signal('');
  public email = signal('');
  public codeConfirm = signal('');
  public repeat = signal(false);
  public createPassword = signal({password: '', password_confirmation: ''});
  public authStep = this.store.selectSignal(selectAuthStep);
  public checkUserFailure = this.store.selectSignal(selectCheckUserFailure);
  public loginFailure = this.store.selectSignal(selectLoginFailure);
  public forgotPasswordFailure = this.store.selectSignal(selectForgotPasswordFailure);
  public validateCreatePassword = signal(false);
  protected readonly EAuthStep = EAuthStep;
  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);
  private sendCodeSubject = new Subject<void>();

  constructor() {
    addIcons(FORM_PASSWORD_ICONS);

    this.sendCodeSubject.pipe(
      throttleTime(10000),
      takeUntilDestroyed()
    ).subscribe(() => {
      void this.executeSendNewCode();
    });
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

  public forgotPassword(): void {
    this.store.dispatch(AuthActions.authStep({step: EAuthStep.ForgotPassword}))
  }

  public changeCodeConfirm(code: string): void {
    this.codeConfirm.set(code)
  }

  async sendNewCode() {
    this.sendCodeSubject.next();
  }

  private async executeSendNewCode() {
    this.store.dispatch(AuthActions.codeConfirm({
      payload: { code: this.codeConfirm(), email: this.email() }
    }));

    const toast = await this.toastController.create({
      message: 'Код відправлено',
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }

  public inputPassword(password: string): void {
    if (!!this.loginFailure()) {
      this.store.dispatch(AuthActions.loginFailure({error: null}))
    }

    this.password.set(password)
  }

  public changePassword(password: string): void {
    if (this.validateCreatePassword()) {
      this.validateCreatePassword.set(false);
    }

    this.createPassword.set({password: password, password_confirmation: password})
  }

  public checkValidatePassword(password: string): void {
    setTimeout(() => {
      this.validateCreatePassword.set(password.length < 8)
    }, 0)
  }

  public goToPrevStep(): void {
    switch (this.authStep()) {
      case EAuthStep.Password:
        this.password.set('');
        this.name.set('');
        this.store.dispatch(AuthActions.authStep({step: EAuthStep.Identifier}));
        break
      case EAuthStep.CreatePassword:
      case EAuthStep.ResetPassword:
        this.createPassword.set({password: '', password_confirmation: ''})
        this.name.set('');
        this.store.dispatch(AuthActions.authStep({step: EAuthStep.Identifier}));
        break
      case EAuthStep.ForgotPassword:
        this.password.set('');
        this.email.set('')
        this.store.dispatch(AuthActions.authStep({step: EAuthStep.Password}))
        break
      case EAuthStep.CodeConfirm:
        this.email.set('')
        this.codeConfirm.set('')
        this.store.dispatch(AuthActions.authStep({step: EAuthStep.ForgotPassword}))
        break
    }
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
        this.store.dispatch(AuthActions.createPassword({payload: this.createPassword() as ISavePassword, repeat: this.repeat()}))
        break
      case EAuthStep.ForgotPassword:
        this.store.dispatch(AuthActions.forgotPassword({payload: {email: this.email()}}))
        break
      case EAuthStep.CodeConfirm:
        this.store.dispatch(AuthActions.codeConfirm({payload: {code: this.codeConfirm(), email: this.email()}}))
        break
      case EAuthStep.ResetPassword:
        this.checkValidatePassword(this.resetPasswordData().password);
        this.store.dispatch(AuthActions.resetPassword({payload: { ...this.resetPasswordData() }}))
    }
  }

  private resetPasswordData(): IResetPassword {
    return {
      reset_token: '',
      email: this.email(),
      ...this.createPassword(),
    }
  }
}
