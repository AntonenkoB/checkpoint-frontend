import {Component, inject, WritableSignal} from "@angular/core";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {SettingsFacade} from "../../facade/settings.facade";
import {
  LANGS_TAB,
  NOTIFICATIONS_ENABLE_TAB,
  NOTIFICATIONS_REMAINDER_TAB,
  THEME_ACTIONS
} from "@settings/models/settings.model";
import {ETheme} from "@models/common.model";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";

@Component({
  selector: "cp-settings-general",
  imports: [
    TranslatePipe,
    HeaderSecondaryComponent,
    TabsComponent,
    IonLabel,
    IonSegment,
    IonSegmentButton
  ],
  templateUrl: "./settings-general.component.html",
  styleUrl: "./settings-general.component.scss",
  providers: [SettingsFacade],
})
export class SettingsGeneralComponent {
  public settingsFacade = inject(SettingsFacade);
  public THEME_ACTIONS = THEME_ACTIONS();
  public LANGS_TAB = LANGS_TAB();
  public NOTIFICATIONS_ENABLE_TAB = NOTIFICATIONS_ENABLE_TAB();
  public NOTIFICATIONS_REMAINDER_TAB = NOTIFICATIONS_REMAINDER_TAB();


  public changeTheme(theme: string): void {
    this.settingsFacade.changeTheme(theme as ETheme);
  }

  public changeLang(lang: string): void {
    // this.settingsFacade.changeTheme(theme as ETheme);
  }

  public changeNotificationEnabled(enabled: string): void {
    // this.settingsFacade.changeTheme(theme as ETheme);
  }

  public changeNotificationRemainder(hours: string): void {
    this.settingsFacade.setReminder(+hours);
  }
}
