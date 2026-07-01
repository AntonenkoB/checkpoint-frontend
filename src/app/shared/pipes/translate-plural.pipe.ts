import {inject, Pipe, PipeTransform} from "@angular/core";
import {TranslateService} from "@shared/services/translate.service";

@Pipe({ name: 'translatePlural', pure: false })
export class TranslatePluralPipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(count: number, key: string, params?: Record<string, string | number>): string {
    this.translateService.translations();
    return this.translateService.plural(key, count, params);
  }
}