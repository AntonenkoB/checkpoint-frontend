import {Routes} from '@angular/router';
import {ProfileFacade} from "@profile/facade/profile.facade";

export const routesProfile: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    providers: [ProfileFacade]
  },
];

export default routesProfile;