import {Routes} from '@angular/router';
import {ERatePages} from "./models/rates.model";
import {ERoutParams} from "@models/router.model";

export const routesRates: Routes = [
  {
    path: ERatePages.RateList,
    loadComponent: () =>
      import('./pages/rete-list/rete-list.component').then((m) => m.ReteListComponent),
  },
  {
    path: `${ERatePages.RateItem}/:${ERoutParams.TeacherId}`,
    loadComponent: () =>
      import('./pages/rete-item/rete-item.component').then((m) => m.ReteItemComponent),
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