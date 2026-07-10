import {inject, Injectable, Signal} from '@angular/core';
import {Store} from '@ngrx/store';

import {AuthStore} from '../store/auth.store';
import {EAuthPages} from '../models/router.model';
import {IAuthLogin, ICodeConfirm, ISavePassword} from '../models/auth.model';

import {RouterActions} from '../../../store/router/actions';
import {EAppPages} from '@models/router.model';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  private readonly authStore = inject(AuthStore);
  private readonly routerStore = inject(Store);

  readonly isLoading: Signal<boolean> = this.authStore.isLoading;
  readonly identifier: Signal<string | null> = this.authStore.identifier;
  readonly email: Signal<string | null> = this.authStore.email;
  readonly checkUserFailure: Signal<string | null> = this.authStore.checkUserFailure;
  readonly loginFailure: Signal<string | null> = this.authStore.loginFailure;
  readonly forgotPasswordFailure: Signal<string | null> = this.authStore.forgotPasswordFailure;
  readonly codeConfirmFailure: Signal<string | null> = this.authStore.codeConfirmFailure;

  // --- Наміри: async-флоу делегуються authStore (навігація на успіх — усередині authStore) ---
  checkUser(identifier: string): void {
    this.authStore.checkUser({identifier});
  }

  login(login: IAuthLogin): void {
    this.authStore.login(login);
  }

  createPassword(payload: ISavePassword, repeat: boolean): void {
    this.authStore.createPassword({payload, repeat});
  }

  forgotPassword(email: string): void {
    this.authStore.forgotPassword({email});
  }

  codeConfirm(code: string): void {
    this.authStore.codeConfirm({code, email: this.email() ?? ''} as ICodeConfirm);
  }

  resetPassword(password: string, passwordConfirmation: string): void {
    this.authStore.resetPassword({
      email: this.email() ?? '',
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  logout(): void {
    this.authStore.logout();
  }

  clearCheckUserFailure(): void {
    this.authStore.clearCheckUserFailure();
  }

  clearLoginFailure(): void {
    this.authStore.clearLoginFailure();
  }

  clearForgotPasswordFailure(): void {
    this.authStore.clearForgotPasswordFailure();
  }

  goToForgotPassword(): void {
    this.routerStore.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginForgotPassword]}));
  }

  backToIdentifier(): void {
    this.routerStore.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier], back: true}));
  }

  backToPassword(): void {
    this.routerStore.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginPassword], back: true}));
  }

  backToForgotPassword(): void {
    this.routerStore.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginForgotPassword], back: true}));
  }
}