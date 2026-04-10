import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {UserActions} from "../../store/actions";
import {selectProfile, selectProfileLoading} from "../../store/selectors";
import {EAppPages} from "@models/router.model";
import {AuthActions} from "../../../auth/store/actions";
import {EUserPages, EUserRole, IUser} from "../../models/user.model";
import {RouterActions} from "../../../../store/router/actions";
import {ThemeService} from "@shared/services/theme.service";
import {ETheme} from "@models/common.model";

@Injectable()
export class ProfileFacade {
  private store = inject<Store<AppState>>(Store);
  public profile = this.store.selectSignal(selectProfile);
  public profileLoading = this.store.selectSignal(selectProfileLoading);
  private themeService = inject(ThemeService);

  public logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  public update(profile: IUser): void {
    this.store.dispatch(UserActions.updateProfile({profile}));
  }

  public addAvatar(blob: Blob): void {
    this.store.dispatch(UserActions.addAvatar({blob}));
  }

  public deleteAvatar(): void {
    this.store.dispatch(UserActions.deleteAvatar());
  }

  public close(): void {
    switch (this.profile()?.role) {
      case EUserRole.Student:
        this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.Profile]}));
        break;
      case EUserRole.Teacher:
        this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]}));
        break;
      case EUserRole.Admin:
        this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]}));
        break;
    }
  }

  public changeTheme(theme: ETheme): void {
    this.themeService.apply(theme)
  }
}