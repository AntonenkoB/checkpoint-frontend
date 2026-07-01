import { Injectable, inject, signal, computed, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ELang } from "@models/common.model";

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private http = inject(HttpClient);
  private readonly intlLocale: Record<string, string> = {
    'ua': 'uk',
    'en': 'en',
  };

  public currentLang = signal<ELang>(ELang.UA);

  private translationsResource = resource({
    params: () => ({ lang: this.currentLang() }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.http.get<Record<string, any>>(`assets/i18n/${params.lang}.json`)
      );
    },
  });

  public translations = computed(() => this.translationsResource.value() ?? {});
  public isLoaded = computed(() => this.translationsResource.hasValue());

  use(lang: ELang): void {
    this.currentLang.set(lang);
  }

  instant(key: string, params?: Record<string, string | number>): string {
    const value = this.resolve(this.translations(), key);
    if (!value || typeof value !== 'string') return key;
    return this.interpolate(value, params);
  }

  plural(key: string, count: number, params?: Record<string, string | number>): string {
    const forms = this.resolve(this.translations(), key);
    if (!forms || typeof forms === 'string') return key;

    const locale = this.intlLocale[this.currentLang()] ?? 'en';
    const rules = new Intl.PluralRules(locale);
    const form = rules.select(count);
    const template = forms[form] ?? forms['other'] ?? key;

    return this.interpolate(template, { count, ...params });
  }

  private resolve(translations: Record<string, any>, key: string): any {
    return key.split('.').reduce((node, k) => node?.[k], translations) ?? null;
  }

  private interpolate(value: string, params?: Record<string, string | number>): string {
    if (!params) return value;
    return value.replace(/{{(\w+)}}/g, (_, k) => String(params[k] ?? ''));
  }
}