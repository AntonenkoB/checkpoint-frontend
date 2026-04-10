import {Routes} from '@angular/router';
import {EAuthPages} from "./models/router.model";

export const routesAuth: Routes = [
  {
    path: EAuthPages.Login,
    loadComponent: () =>
        import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: EAuthPages.Onboarding,
    loadComponent: () =>
        import('./pages/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: '',
    redirectTo: EAuthPages.Login,
    pathMatch: 'full',
  },
];

export default routesAuth;