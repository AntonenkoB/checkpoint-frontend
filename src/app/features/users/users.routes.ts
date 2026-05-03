import {Routes} from '@angular/router';
import {EUserPages} from "./models/user.model";
import {EAppPages, ERoutParams} from "@models/router.model";
import {ESchedulePages} from "../schedule/models/schedule.model";

export const routesUsers: Routes = [
  {
    path: EUserPages.ListUsers,
    loadComponent: () =>
        import('./pages/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: EUserPages.Student,
    loadComponent: () =>
      import('./pages/student/student.component').then((m) => m.StudentComponent),
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
    path: `${EAppPages.Schedule}/${ESchedulePages.List}/:${ERoutParams.UserId}`,
    loadComponent: () =>
      import('../schedule/pages/schedule-list/schedule-list.component').then((m) => m.ScheduleListComponent),
  },
  {
    path: '',
    redirectTo: EUserPages.ListUsers,
    pathMatch: 'full',
  },
];

export default routesUsers;