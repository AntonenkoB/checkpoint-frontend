import {Routes} from '@angular/router';
import {EMarketPages} from "./models/market.model";

export const routesMarket: Routes = [
  {
    path: EMarketPages.Type,
    loadComponent: () =>
      import('./pages/lessons-type/lessons-type.component').then((m) => m.LessonsTypeComponent),
  },
  {
    path: EMarketPages.Teachers,
    loadComponent: () =>
      import('./pages/teachers/teachers.component').then((m) => m.TeachersComponent),
  },
  {
    path: EMarketPages.Payment,
    loadComponent: () =>
      import('./pages/lessons-payment/lessons-payment.component').then((m) => m.LessonsPaymentComponent),
  },
  {
    path: EMarketPages.PaymentType,
    loadComponent: () =>
      import('./pages/lessons-type-payment/lessons-type-payment.component').then((m) => m.LessonsTypePaymentComponent),
  },
  {
    path: EMarketPages.PaymentSuccess,
    loadComponent: () =>
      import('./pages/payment-success/payment-success.component').then((m) => m.PaymentSuccessComponent),
  },
  {
    path: '',
    redirectTo:  EMarketPages.Type,
    pathMatch: 'full',
  },
];

export default routesMarket;