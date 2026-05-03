import {Routes} from '@angular/router';
import {ERatePages} from "./models/rates.model";
import {ERoutParams} from "@models/router.model";
import {EUserPages} from "@users/models/user.model";

export const routesRates: Routes = [
  {
    path: ERatePages.Teachers,
    loadComponent: () =>
      import('./pages/rete-list/rete-list.component').then((m) => m.ReteListComponent),
  },
  {
    path: ERatePages.Salary,
    loadComponent: () =>
      import('./pages/salary-item/salary-item.component').then((m) => m.SalaryItemComponent),
  },
  {
    path: `${ERatePages.RateItem}/:${ERoutParams.TeacherId}`,
    loadComponent: () =>
      import('./pages/rete-item/rete-item.component').then((m) => m.ReteItemComponent),
  },
  {
    path: '',
    redirectTo: ERatePages.RateItem,
    pathMatch: 'full',
  },
];

export default routesRates;