import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {map} from "rxjs";
import {TokenService} from "@shared/services/token-service";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, take} from "rxjs/operators";
import {EAuthPages} from "../../features/auth/models/router.model";
import {EAppPages} from "@models/router.model";

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return toObservable(tokenService.isLoaded).pipe(
    filter(isLoaded => isLoaded),
    take(1),
    map(() => {
      if (tokenService.isAuthenticated()) {
        return true;
      } else {
        void router.navigate([EAppPages.Auth, EAuthPages.Login]);
        return false;
      }
    })
  );
};

