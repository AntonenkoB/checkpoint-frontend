import {Routes} from '@angular/router';
import {EAppPages} from "@models/router.model";
import {AuthGuard} from "@shared/guards/auth.guard";

export const routes: Routes = [
  {
    path: EAppPages.Auth,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routesAuth),
  },
  {
    path: EAppPages.Users,
    loadChildren: () => import('./features/users/users.routes').then((m) => m.routesUsers),
    canActivate: [AuthGuard],
  },
  {
    path: EAppPages.Schedule,
    loadChildren: () => import('./features/schedule/schedule.routes').then((m) => m.routesSchedule),
    canActivate: [AuthGuard],
  },
  {
    path: EAppPages.Market,
    loadChildren: () => import('./features/market/market.routes').then((m) => m.routesMarket),
    canActivate: [AuthGuard],
  },
  {
    path: EAppPages.Rates,
    loadChildren: () => import('./features/rates/rates.routes').then((m) => m.routesRates),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: EAppPages.Users,
    pathMatch: 'full',
  },
];
