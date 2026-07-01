import {Component, inject, ViewChild} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IonButton, IonContent, IonModal} from "@ionic/angular/standalone";
import {SettingsFacade} from "../../facade/settings.facade";
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {Platform} from "@ionic/angular";
import {TranslatePluralPipe} from "@shared/pipes/translate-plural.pipe";

@Component({
  selector: "cp-settings-list",
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    IonButton,
    IonContent,
    ConfirmModalComponent,
    IonModal,
    TranslatePluralPipe
  ],
  templateUrl: "./settings-list.component.html",
  styleUrl: "./settings-list.component.scss",
  providers: [SettingsFacade],
})
export class SettingsListComponent {
  @ViewChild('exitModal') exitModal!: IonModal;
  @ViewChild('deleteModal') deleteModal!: IonModal;

  public settingsFacade = inject(SettingsFacade);
  private platform = inject(Platform);

  public modalBreakpoints = this.platform.is('desktop') ? undefined : [0, 0.5, 1];
  public initialBreakpoint = this.platform.is('desktop') ? undefined : 0.5;

  public exitModalCansel(): void {
    void this.exitModal.dismiss();
  }

  public exitModalConfirm(): void {
    void this.exitModal.dismiss();
    this.settingsFacade.logout();
  }

  public deleteModalCansel(): void {
    void this.deleteModal.dismiss();
  }

  public deleteModalConfirm(): void {
    void this.deleteModal.dismiss();
  }
}
