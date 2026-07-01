import {computed, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";
import {EAppPages} from "@models/router.model";
import {RouterActions} from "../../../store/router/actions";
import {IUser} from "@models/user.model";
import {ProfileStore} from "@profile/store/profile.store";
import {Permission} from "@shared/permissions/permissions.config";
import {ESettingsPages} from "../../settings/models/settings.model";

@Injectable({ providedIn: 'root' })
export class ProfileFacade {
  private store = inject<Store<AppState>>(Store);
  public profileStore = inject(ProfileStore);

  public readonly profile = this.profileStore.profile;
  public readonly isLoading = this.profileStore.isLoading;
  public readonly activeRole = this.profileStore.activeRole;

  public readonly isOwner = this.profileStore.isOwner;
  public readonly isAdmin = this.profileStore.isAdmin;
  public readonly isTeacher = this.profileStore.isTeacher;
  public readonly isStudent = this.profileStore.isStudent;

  // permissions

  public can(permission: Permission): Signal<boolean> {
    return computed(() => this.profileStore.hasPermission(permission));
  }

  public canAny(permissions: Permission[]): Signal<boolean> {
    return computed(() => this.profileStore.hasAnyPermission(permissions));
  }

  public canAll(permissions: Permission[]): Signal<boolean> {
    return computed(() => this.profileStore.hasAllPermissions(permissions));
  }

  public checkPermission(permission: Permission): boolean {
    return this.profileStore.hasPermission(permission);
  }

  public checkAnyPermission(permissions: Permission[]): boolean {
    return this.profileStore.hasAnyPermission(permissions);
  }

  // permissions

  public update(profile: IUser): void {
    this.profileStore.updateProfile(profile)
  }

  public addAvatar(blob: Blob): void {
    this.profileStore.addAvatar(blob)
  }

  public deleteAvatar(): void {
    this.profileStore.deleteAvatar()
  }

  public goToBack(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.List], back: true}));
  }
}