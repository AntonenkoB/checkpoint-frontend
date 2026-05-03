import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {NavigationExtras} from '@angular/router';
import {TRouter} from "@models/router.model";

export const RouterActions = createActionGroup({
  source: 'Router',
  events: {
    goTo: props<{ path: TRouter[]; extras?: NavigationExtras }>(),
    goToSuccess: emptyProps(),
    goToFailure: props<{ error: string }>(),
  },
});