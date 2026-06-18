import {CanActivateFn, Router} from "@angular/router";
import {Permission, PermissionMode} from "@shared/permissions/permissions.config";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {inject} from "@angular/core";
import {EAppPages} from "@models/router.model";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, take} from "rxjs/operators";
import {map} from "rxjs";

export const permissionGuard = (
  permission: Permission | Permission[],
  mode: PermissionMode = 'all',
): CanActivateFn => () => {
  const facade = inject(ProfileFacade);
  const router = inject(Router);

  return toObservable(facade.profileStore.isReady).pipe(
    filter(isReady => isReady),
    take(1),
    map(() => {
      const perms = Array.isArray(permission) ? permission : [permission];
      const granted = mode === 'any'
        ? facade.checkAnyPermission(perms)
        : perms.every(p => facade.checkPermission(p));

      if (granted) return true;


      if (facade.profileStore.isStudent()) {
        return router.createUrlTree([EAppPages.Student]);
      }

      return router.createUrlTree([EAppPages.Users]);
    })
  );
};
