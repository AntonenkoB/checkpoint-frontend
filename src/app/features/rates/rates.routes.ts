import {Routes} from '@angular/router';
import {ERatePages} from "./models/rates.model";
import {ERoutParams} from "@models/router.model";
import {AuthGuard} from "@shared/guards/auth.guard";
import {ProfileLoadGuard} from "@shared/guards/profile-load.guard";
import {permissionGuard} from "@shared/guards/permission.guard";

export const routesRates: Routes = [
  {
    path: ERatePages.RateList,
    loadComponent: () =>
      import('./pages/rete-list/rete-list.component').then((m) => m.ReteListComponent),
    canActivate: [AuthGuard, ProfileLoadGuard, permissionGuard('rate:read')],
  },
  {
    path: `${ERatePages.RateItem}/:${ERoutParams.TeacherId}`,
    loadComponent: () =>
      import('./pages/rete-item/rete-item.component').then((m) => m.ReteItemComponent),
    canActivate: [AuthGuard, ProfileLoadGuard, permissionGuard('rate:update')],
  },
  {
    path: ERatePages.SalaryList,
    loadComponent: () =>
      import('./pages/salary-list/salary-list.component').then((m) => m.SalaryListComponent),
  },
  {
    path: `${ERatePages.SalaryItem}/:${ERoutParams.TeacherId}`,
    loadComponent: () =>
      import('./pages/salary-item/salary-item.component').then((m) => m.SalaryItemComponent),
  },
  {
    path: '',
    redirectTo: ERatePages.RateItem,
    pathMatch: 'full',
  },
];

export default routesRates;