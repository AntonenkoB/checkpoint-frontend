import {inject, provideAppInitializer} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {TranslateService} from "@shared/services/translate.service";

export function provideI18n() {
  return provideAppInitializer(async () => {
    const translate = inject(TranslateService);
    await firstValueFrom(translate.translations$);
  });
}