import {Routes} from '@angular/router';
import {EUserPages} from "./models/user.model";
import {ERoutParams} from "@models/router.model";

export const routesUsers: Routes = [
  {
    path: EUserPages.ListUsers,
    loadComponent: () =>
        import('./pages/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: EUserPages.Profile,
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: `${EUserPages.User}/:${ERoutParams.UserId}`,
    loadComponent: () =>
        import('./pages/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: EUserPages.Create,
    loadComponent: () =>
        import('./pages/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: '',
    redirectTo: EUserPages.ListUsers,
    pathMatch: 'full',
  },
];

export default routesUsers;