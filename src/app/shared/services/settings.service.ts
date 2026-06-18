import {inject, Injectable, signal} from "@angular/core";
import {Preferences} from "@capacitor/preferences";
import {ELang, ETheme, IAppSettings} from "@models/common.model";
import {Capacitor} from "@capacitor/core";
import {ThemeService} from "@shared/services/theme.service";

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public lang = signal<ELang>(ELang.UA);
  public theme = signal<ETheme>(ETheme.System);
  public repeat = signal<boolean>(!Capacitor.isNativePlatform());
  private themeService = inject(ThemeService);

  async loadSettings() {
    const { value: settingsJson } = await Preferences.get({ key: 'app_settings' });
    if (settingsJson) {
      const settings: IAppSettings = JSON.parse(settingsJson);
      this.lang.set(settings.lang as ELang);
      this.theme.set(settings.theme);
      this.repeat.set(!Capacitor.isNativePlatform() ? (settings.repeat ?? false) : true);
    }
  }

  async updateSettings(partial: Partial<IAppSettings>) {
    if (partial.lang) this.lang.set(partial.lang as ELang);
    if (partial.theme) this.theme.set(partial.theme);
    this.repeat.set(!Capacitor.isNativePlatform() ? (partial.repeat ?? false) : true);

    const current: IAppSettings = {
      lang: this.lang(),
      theme: this.theme(),
      repeat: this.repeat(),
    };

    try {
      await Preferences.set({ key: 'app_settings', value: JSON.stringify(current) });
    } catch (error) {
      console.error('Помилка запису в Capacitor Preferences:', error);
    }
  }

  public getCurrentSettings(): IAppSettings {
    return {
      lang: this.lang(),
      theme: this.theme(),
      repeat: this.repeat(),
    };
  }

  async clearSettings() {
    this.lang.set(ELang.UA);
    this.theme.set(ETheme.Light);
    this.repeat.set(!Capacitor.isNativePlatform());

    this.themeService.apply(this.theme())
    await Preferences.remove({ key: 'app_settings' });
  }
}
