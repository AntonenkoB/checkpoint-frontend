import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {NavigationExtras} from '@angular/router';
import {TRouter} from "@models/router.model";

export const RouterActions = createActionGroup({
  source: 'Router',
  events: {
    navigate: props<{ path: TRouter[]; extras?: NavigationExtras }>(),
    navigateSuccess: emptyProps(),
    navigateFailure: props<{ error: string }>(),
  },
});