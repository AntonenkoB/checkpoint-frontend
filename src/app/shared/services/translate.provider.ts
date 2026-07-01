import { inject, provideAppInitializer } from '@angular/core';
import { TranslateService } from "@shared/services/translate.service";

export function provideI18n() {
  return provideAppInitializer(async () => {
    const translate = inject(TranslateService);
    while (!translate.isLoaded()) {
      await new Promise(r => setTimeout(r, 10));
    }
  });
}