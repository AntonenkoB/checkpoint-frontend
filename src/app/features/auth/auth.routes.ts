import {Routes} from '@angular/router';
import {EAuthPages} from "./models/router.model";

export const routesAuth: Routes = [
  {
    path: EAuthPages.LoginIdentifier,
    loadComponent: () =>
        import('./pages/login-identifier/login-identifier.component').then((m) => m.LoginIdentifierComponent),
  },
  {
    path: EAuthPages.LoginPassword,
    loadComponent: () =>
        import('./pages/login-password/login-password.component').then((m) => m.LoginPasswordComponent),
  },
  {
    path: EAuthPages.LoginCreatePassword,
    loadComponent: () =>
        import('./pages/login-create-password/login-create-password.component').then((m) => m.LoginCreatePasswordComponent),
  },
  {
    path: EAuthPages.LoginForgotPassword,
    loadComponent: () =>
        import('./pages/login-forgot-password/login-forgot-password.component').then((m) => m.LoginForgotPasswordComponent),
  },
  {
    path: EAuthPages.LoginCodeConfirm,
    loadComponent: () =>
        import('./pages/login-code-confirm/login-code-confirm.component').then((m) => m.LoginCodeConfirmComponent),
  },
  {
    path: EAuthPages.LoginResetPassword,
    loadComponent: () =>
        import('./pages/login-reset-password/login-reset-password.component').then((m) => m.LoginResetPasswordComponent),
  },
  {
    path: EAuthPages.Onboarding,
    loadComponent: () =>
        import('./pages/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: '',
    redirectTo: EAuthPages.LoginIdentifier,
    pathMatch: 'full',
  },
];

export default routesAuth;