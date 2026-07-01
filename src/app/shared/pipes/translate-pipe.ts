import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from "@shared/services/translate.service";

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(key: string, params?: Record<string, string | number>): string {
    this.translateService.translations();
    return this.translateService.instant(key, params);
  }
}