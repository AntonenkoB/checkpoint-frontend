import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {from, of, switchMap} from 'rxjs';
import {RouterActions} from "./actions";
import {catchError} from "rxjs/operators";

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router) {
  }

  goTo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouterActions.goTo),
      switchMap(({ path, extras }) =>
        from(this.router.navigate(path, extras)).pipe(
          switchMap(() => of(RouterActions.goToSuccess())),
          catchError((error) => of(RouterActions.goToFailure({ error: error.message })))
        )
      )
    )
  );
}