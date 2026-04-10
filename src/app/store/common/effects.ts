import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, from, of, map, switchMap, tap, forkJoin} from 'rxjs';
import {CommonActions} from './actions';
import {IAppSettings} from '@models/common.model';
import {TranslateService} from "@shared/services/translate.service";
import {UserActions} from "../../features/users/store/actions";
import {TokenService} from "@shared/services/token-service";
import {SettingsService} from "@shared/services/settings.service";
import {PlatformService} from "@shared/services/platform.service";
import {Action} from "@ngrx/store";
import {ThemeService} from "@shared/services/theme.service";

@Injectable()
export class CommonEffects {
  private actions$ = inject(Actions);
  private translateService = inject(TranslateService);
  private tokenService = inject(TokenService);
  private settingsService = inject(SettingsService);
  private platformService = inject(PlatformService);
  private themeService = inject(ThemeService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommonActions.initialize),
      switchMap(() => forkJoin([
        this.settingsService.loadSettings(),
        this.tokenService.loadToken()
      ])),
      switchMap(() => {
        const shouldClear = !this.platformService.isNative &&
          !this.settingsService.repeat();

        if (shouldClear) {
          return from(this.tokenService.clearToken()).pipe(
            map(() => this.finalizeInitialization())
          );
        }

        return of(this.finalizeInitialization());
      }),
      switchMap(actions => from(actions)),
      catchError((error) =>
        of(CommonActions.initializeFailure({ error: error?.message || 'Initialization failed' }))
      )
    )
  );

  private finalizeInitialization(): Action[] {
    const currentLang = this.settingsService.lang();
    this.translateService.use(currentLang);
    this.themeService.apply(this.settingsService.theme());


    const appSetting: IAppSettings = {
      lang: currentLang,
      theme: this.settingsService.theme(),
      repeat: this.settingsService.repeat()
    };

    const actions: Action[] = [
      CommonActions.initializeSuccess({ initialized: true }),
      CommonActions.setting({ setting: appSetting })
    ];

    if (this.tokenService.isAuthenticated()) {
      actions.push(UserActions.getProfile());
    }

    return actions;
  }
}
