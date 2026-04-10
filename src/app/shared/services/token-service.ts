import { Injectable, signal, computed } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _token = signal<string | null>(null);
  public isLoaded = signal<boolean>(false);
  public readonly token = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());


  async loadToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    this._token.set(value);
    this.isLoaded.set(true);
    return value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: 'auth_token', value: token });
    this._token.set(token);
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: 'auth_token' });
    this._token.set(null);
  }
}