import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  map,
  shareReplay
} from 'rxjs';
import {ELang} from "@models/common.model";


@Injectable({providedIn: 'root'})
export class TranslateService {
  private http = inject(HttpClient);

  private _lang$ = new BehaviorSubject<ELang>(ELang.UA);
  private _translations: Record<string, any> = {};

  readonly currentLang$ = this._lang$.asObservable();

  readonly translations$: Observable<Record<string, any>> = this._lang$.pipe(
      switchMap(lang =>
          this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`)
      ),
      shareReplay(1)
  );

  readonly isLoaded$: Observable<boolean> = this.translations$.pipe(
      map(t => Object.keys(t).length > 0)
  );

  use(lang: ELang): void {
    this._lang$.next(lang);
  }

  translate(key: string, params?: Record<string, string | number>): Observable<string> {
    return this.translations$.pipe(
        map(translations => this.instant(key, translations, params))
    );
  }

  instant(key: string, translations?: Record<string, any>, params?: Record<string, string | number>): string {
    const t = translations ?? this._translations;
    const value = this.resolve(t, key);
    if (!value) return key;
    return this.interpolate(value, params);
  }

  private resolve(translations: Record<string, any>, key: string): string | null {
    const keys = key.split('.');
    let node: any = translations;
    for (const k of keys) {
      node = node?.[k];
      if (node === undefined) return null;
    }
    return typeof node === 'string' ? node : null;
  }

  private interpolate(value: string, params?: Record<string, string | number>): string {
    if (!params) return value;
    return value.replace(/{{(\w+)}}/g, (_, key) => String(params[key] ?? ''));
  }
}