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
    path: '',
    redirectTo: EAppPages.Users,
    pathMatch: 'full',
  },
];
