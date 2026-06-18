import {Routes} from '@angular/router';
import {EMarketPages} from "./models/market.model";

export const routesMarket: Routes = [
  {
    path: `${EMarketPages.PaymentType}/:teacherId`,
    loadComponent: () =>
      import('./pages/lessons-type-payment/lessons-type-payment.component').then((m) => m.LessonsTypePaymentComponent),
  },
  {
    path: EMarketPages.Payment,
    loadComponent: () =>
      import('./pages/lessons-payment/lessons-payment.component').then((m) => m.LessonsPaymentComponent),
  },

  {
    path: EMarketPages.PaymentSuccess,
    loadComponent: () =>
      import('./pages/payment-success/payment-success.component').then((m) => m.PaymentSuccessComponent),
  },
  {
    path: '',
    redirectTo:  EMarketPages.LessonsType,
    pathMatch: 'full',
  },
];

export default routesMarket;