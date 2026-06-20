import {EnvironmentProviders, Provider} from '@angular/core';
import {DatePipe} from '@angular/common';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {provideMockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';

import {TranslateService} from '@shared/services/translate.service';

/**
 * Lightweight stub for the runtime i18n service. Avoids real HTTP loading of
 * `assets/i18n/*.json` during unit tests — `instant`/`translate` echo the key back.
 */
export class MockTranslateService {
  readonly currentLang$ = of('ua');
  readonly translations$ = of({});
  readonly isLoaded$ = of(true);

  use(): void {}

  translate(key: string) {
    return of(key);
  }

  instant(key: string): string {
    return key;
  }
}

/**
 * Common providers for component / page / service unit tests.
 *
 * Covers the infrastructure that most units transitively depend on:
 * NgRx `Store` (mock), `Router`/`ActivatedRoute`, `HttpClient` (testing),
 * Ionic providers, `DatePipe` and the runtime translate service.
 */
export function commonTestProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideIonicAngular(),
    provideMockStore(),
    DatePipe,
    {provide: TranslateService, useClass: MockTranslateService},
  ];
}