import {computed, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";
import {EAppPages} from "@models/router.model";
import {AuthActions} from "@auth/store/actions";
import {RouterActions} from "../../../store/router/actions";
import {ThemeService} from "@shared/services/theme.service";
import {ETheme} from "@models/common.model";
import {EHeaderMenu, EUserPages} from "@users/models/user.model";
import {IUser, EUserRole} from "@models/user.model";
import {ProfileStore} from "@profile/store/profile.store";
import {EStudentPages} from "@student/models/student.model";
import {Permission} from "@shared/permissions/permissions.config";
import {EStudentProfileTabs} from "@profile/models/profile.model";

@Injectable({ providedIn: 'root' })
export class ProfileFacade {
  private store = inject<Store<AppState>>(Store);
  public profileStore = inject(ProfileStore);
  private themeService = inject(ThemeService);
  public readonly profile = this.profileStore.profile;
  public readonly isLoading = this.profileStore.isLoading;

  public readonly isOwner = this.profileStore.isOwner;
  public readonly isAdmin = this.profileStore.isAdmin;
  public readonly isTeacher = this.profileStore.isTeacher;
  public readonly isStudent = this.profileStore.isStudent;

  // ── Права доступу ──────────────────────────────────────────

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

  // ── Права доступу ──────────────────────────────────────────


  public loadProfile(): void {
    this.profileStore.getProfile();
  }

  public logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  public update(profile: IUser): void {
    this.profileStore.updateProfile(profile)
  }

  public addAvatar(blob: Blob): void {
    this.profileStore.addAvatar(blob)
  }

  public deleteAvatar(): void {
    this.profileStore.deleteAvatar()
  }

  public deleteAccount(): void {
    this.profileStore.deleteAccount()
  }

  public close(): void {
    switch (this.profile()?.role) {
      case EUserRole.Student:
        this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student, EStudentPages.StudentDashboard], back: true}));
        break;
      case EUserRole.Teacher:
      case EUserRole.Admin:
      case EUserRole.Owner:
        this.store.dispatch(RouterActions.goTo({
          path: [EAppPages.Users, EUserPages.ListUsers],
          extras: {queryParams: {tab: EHeaderMenu.Student}},
          back: true
        }));
        break;
    }
  }

  public changeTheme(theme: ETheme): void {
    this.themeService.apply(theme)
  }

  public goToStudentPage(page: EStudentProfileTabs): void {
    switch (page) {
      case EStudentProfileTabs.Purchases:
        this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student, EStudentPages.HistoryPurchases]}));
        break;
      case EStudentProfileTabs.Lessons:
        this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student, EStudentPages.HistoryLessons]}));
        break;
    }
  }
}