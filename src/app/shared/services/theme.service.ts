import {Injectable, signal} from "@angular/core";
import {ETheme} from "@models/common.model";
import {Capacitor, SystemBars, SystemBarsStyle} from "@capacitor/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  public currentTheme = signal<ETheme>(ETheme.System);

  public apply(theme: ETheme): void {
    this.currentTheme.set(theme);

    switch (theme) {
      case ETheme.Dark:
        this.setDark(true);
        this.removeSystemListener();
        break;
      case ETheme.Light:
        this.setDark(false);
        this.removeSystemListener();
        break;
      case ETheme.System:
        this.applySystem();
        this.addSystemListener();
        break;
    }
  }

  private applySystem(): void {
    this.setDark(this.mediaQuery.matches);
  }

  private setDark(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);

    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      void SystemBars.setStyle({
        style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
      });
    }
  }

  private systemListener = () => this.applySystem();

  private addSystemListener(): void {
    this.mediaQuery.addEventListener('change', this.systemListener);
  }

  private removeSystemListener(): void {
    this.mediaQuery.removeEventListener('change', this.systemListener);
  }
}