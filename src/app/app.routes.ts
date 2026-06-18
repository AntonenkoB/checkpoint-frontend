import {Routes} from '@angular/router';
import {EAppPages} from "@models/router.model";
import {AuthGuard} from "@shared/guards/auth.guard";
import {permissionGuard} from "@shared/guards/permission.guard";
import {ProfileLoadGuard} from "@shared/guards/profile-load.guard";

export const routes: Routes = [
  {
    path: EAppPages.Auth,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routesAuth),
  },
  {
    path: EAppPages.Users,
    loadChildren: () => import('./features/users/users.routes').then((m) => m.routesUsers),
    canActivate: [AuthGuard, ProfileLoadGuard, permissionGuard('users:read')],
  },
  {
    path: EAppPages.Schedule,
    loadChildren: () => import('./features/schedule/schedule.routes').then((m) => m.routesSchedule),
    canActivate: [AuthGuard, ProfileLoadGuard],
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
    path: EAppPages.Lessons,
    loadChildren: () => import('./features/lessons/lessons.routes').then((m) => m.routesLessons),
    canActivate: [AuthGuard],
  },
  {
    path: EAppPages.Student,
    loadChildren: () => import('./features/student/student.routes').then((m) => m.routesStudent),
    canActivate: [AuthGuard],
  },
  {
    path: EAppPages.Profile,
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.routesProfile),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: EAppPages.Users,
    pathMatch: 'full',
  },
];
