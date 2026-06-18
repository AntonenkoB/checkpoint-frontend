import {Injectable, signal, computed, inject} from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {PlatformService} from "@shared/services/platform.service";

@Injectable({ providedIn: 'root' })
export class TokenService {
  private platformService = inject(PlatformService);

  private _token = signal<string | null>(null);
  public isLoaded = signal<boolean>(false);
  public readonly token = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());


  async loadToken(): Promise<string | null> {
    // const { value } = await Preferences.get({ key: 'auth_token' });

    let value: string | null = null;

    if (this.platformService.isNative) {
      const result = await Preferences.get({ key: 'auth_token' });
      value = result.value;
    } else {
      const result = await Preferences.get({ key: 'auth_token' });
      value = sessionStorage.getItem('auth_token') || result.value;
    }

    this._token.set(value);
    this.isLoaded.set(true);
    return value;

    // let value: string | null = null;
    //
    // if (this.platformService.isNative) {
    //   const result = await Preferences.get({ key: 'auth_token' });
    //   value = result.value;
    // } else {
    //   value = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    // }
    //
    // this._token.set(value);
    // this.isLoaded.set(true);
    // return value;
  }

  async setToken(token: string, rememberMe: boolean): Promise<void> {
    await Preferences.set({ key: 'auth_token', value: token });
    sessionStorage.setItem('auth_token', token);

    this._token.set(token);

    if (this.platformService.isNative) {
      await Preferences.set({ key: 'auth_token', value: token });
    } else {
      if (rememberMe) {
        sessionStorage.removeItem('auth_token');
        await Preferences.set({ key: 'auth_token', value: token });
      } else {
        sessionStorage.setItem('auth_token', token);
      }
    }
    //
    // this._token.set(token);
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: 'auth_token' });
    sessionStorage.removeItem('auth_token');
    this._token.set(null);

    // if (this.platformService.isNative) {
    //   await Preferences.remove({ key: 'auth_token' });
    // } else {
    //   sessionStorage.removeItem('auth_token');
    // }
    //
    // this._token.set(null);
  }
}