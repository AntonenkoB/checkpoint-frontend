import {Pipe, PipeTransform, inject, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {TranslateService} from "@shared/services/translate.service";

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  private currentTranslations: Record<string, any> = {};
  private sub: Subscription;

  constructor() {
    this.sub = this.translateService.translations$.subscribe(t => {
      this.currentTranslations = t;
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: Record<string, string | number>): string {
    return this.translateService.instant(key, this.currentTranslations, params);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}