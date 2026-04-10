import {isDevMode, provideZonelessChangeDetection} from "@angular/core";
import {bootstrapApplication} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {provideEffects} from "@ngrx/effects";
import {provideStore} from "@ngrx/store";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {appEffects, appReducers} from "./app/store/app-store";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideI18n} from "@shared/services/translate.provider";
import {provideRouterStore} from "@ngrx/router-store";
import {apiInterceptor} from "@shared/interceptors/api.interceptor";


const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore(appReducers),
    provideEffects(appEffects),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
    provideHttpClient(
        withInterceptors([apiInterceptor])
    ),
  ],
};

void bootstrapApplication(AppComponent, appConfig)
    .then(() => {
      provideI18n()
    })
    .catch((err) => console.error(err));
