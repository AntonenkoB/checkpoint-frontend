import { CanActivateFn } from "@angular/router";
import {inject} from "@angular/core";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, take} from "rxjs/operators";
import {map} from "rxjs";

export const ProfileLoadGuard: CanActivateFn = (route, state) => {
  const profileFacade = inject(ProfileFacade);

  return toObservable(profileFacade.profile).pipe(
    filter(profile => !!profile),
    take(1),
    map(() => true)
  );
};
