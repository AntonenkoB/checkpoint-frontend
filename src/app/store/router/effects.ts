import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs';
import {RouterActions} from "./actions";

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router) {
  }

  navigate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouterActions.navigate),
      switchMap(({path, extras}) =>
        this.router.navigate(path, extras).then(
          () => RouterActions.navigateSuccess(),
          (error) => RouterActions.navigateFailure({error: error.message})
        )
      )
    )
  );
}