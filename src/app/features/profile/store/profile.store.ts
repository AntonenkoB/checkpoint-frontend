import {inject, computed, Injector} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap, catchError, of} from 'rxjs';
import {EUserRole, IUser} from "@models/user.model";
import {ThemeService} from "@shared/services/theme.service";
import {ProfileService} from "../services/profile.service";
import {SettingsService} from "@shared/services/settings.service";
import {Permission, ROLE_PERMISSIONS} from "@shared/permissions/permissions.config";
import {ImpactStyle} from "@capacitor/haptics";
import {HapticService} from "@shared/services/haptic.service";
import {ToastService} from "@shared/services/toast.service";
import {Preferences} from "@capacitor/preferences";
import {getHighestRole} from "@shared/permissions/role-priority";
import {AuthStore} from "@auth/store/auth.store";

export interface ProfileState {
  isLoading: boolean;
  profile: IUser | null;
  activeRole: EUserRole | null;
}

const initialState: ProfileState = {
  isLoading: false,
  profile: null,
  activeRole: null,
};

const ACTIVE_ROLE_KEY = 'active_role';

export const ProfileStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities<IUser>(),

  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading() && state.profile() !== null),
    isOwner: computed(() => state.activeRole() === EUserRole.Owner),
    isAdmin: computed(() => state.activeRole() === EUserRole.Admin),
    isTeacher: computed(() => state.activeRole() === EUserRole.Teacher),
    isStudent: computed(() => state.activeRole() === EUserRole.Student),

    effectivePermissions: computed(() => {
      const role = state.activeRole();
      if (!role) return [];
      return ROLE_PERMISSIONS[role] ?? [];
    }),
  })),

  withMethods((state) => {
    return {
      hasPermission(permission: Permission): boolean {
        return state.effectivePermissions().includes(permission);
      },

      hasAnyPermission(permissions: Permission[]): boolean {
        return permissions.some(p => state.effectivePermissions().includes(p));
      },

      hasAllPermissions(permissions: Permission[]): boolean {
        return permissions.every(p => state.effectivePermissions().includes(p));
      },

      async setActiveRole(role: EUserRole | null): Promise<void> {
        if (!role) return;

        const availableRoles = state.profile()?.roles ?? [];
        if (!availableRoles.includes(role)) return;

        patchState(state, { activeRole: role });
        await Preferences.set({ key: ACTIVE_ROLE_KEY, value: role });
      },

      async restoreActiveRole(): Promise<void> {
        const { value } = await Preferences.get({ key: ACTIVE_ROLE_KEY });
        const available = state.profile()?.roles ?? [];
        const saved = value as EUserRole | null;

        const role = (saved && available.includes(saved))
          ? saved
          : getHighestRole(available);

        void this.setActiveRole(role);
      },

      async clearActiveRole(): Promise<void> {
        await Preferences.remove({ key: ACTIVE_ROLE_KEY});
        patchState(state, { activeRole: null });
      }
    };
  }),

  withMethods((
    state,
    injector = inject(Injector),
    profileService = inject(ProfileService),
    themeService = inject(ThemeService),
    settingsService = inject(SettingsService),
    toastService = inject(ToastService),
    hapticService = inject(HapticService),
  ) => ({
    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => profileService.getProfile().pipe(
          tap((response) => {
            patchState(state, {
              profile: response.data,
              isLoading: false
            });

            themeService.apply(response.data.theme);
            state.restoreActiveRole();
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),

    updateProfile: rxMethod<IUser>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => profileService.updateProfile(data).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {
                profile: response.data,
                isLoading: false
              });
              toastService.success('Профіль оновлено');
              void hapticService.impact(ImpactStyle.Medium);
              settingsService.updateSettings({
                ...settingsService.getCurrentSettings(),
                theme: response.data.theme
              }).then();
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    addAvatar: rxMethod<Blob>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((blob) => {

            const formData = new FormData();
            const file = new File([blob], 'avatar.webp', {type: 'image/webp'});
            formData.append('avatar', file);

            return profileService.addAvatar(formData).pipe(
              tap((response) => {
                if (response?.data) {
                  patchState(state, {
                    profile: response.data,
                    isLoading: false
                  });
                } else {
                  patchState(state, {isLoading: false});
                }
              }),
              catchError((err) => {
                patchState(state, {isLoading: false});
                return of(null);
              })
            )
          }
        )
      )
    ),

    deleteAvatar: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => profileService.deleteAvatar().pipe(
          tap((response) => {
            if (response?.data) {
              void hapticService.impact(ImpactStyle.Medium);

              patchState(state, {
                profile: response.data,
                isLoading: false
              });
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),

    deleteAccount: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => profileService.deleteAccount().pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {isLoading: false});

              injector.get(AuthStore).logout();
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),
  }))
);
