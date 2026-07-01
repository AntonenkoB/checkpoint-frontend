import {Routes} from '@angular/router';
import {ESettingsPages} from "./models/settings.model";

export const routesSettings: Routes = [
  {
    path: ESettingsPages.List,
    loadComponent: () =>
      import('./pages/settings-list/settings-list.component').then((m) => m.SettingsListComponent),
  },
  {
    path: ESettingsPages.General,
    loadComponent: () =>
      import('./pages/settings-general/settings-general.component').then((m) => m.SettingsGeneralComponent),
  },
  {
    path: ESettingsPages.Terms,
    loadComponent: () =>
      import('./pages/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: ESettingsPages.Privacy,
    loadComponent: () =>
      import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: '',
    redirectTo: ESettingsPages.List,
    pathMatch: 'full',
  },
];

export default routesSettings;