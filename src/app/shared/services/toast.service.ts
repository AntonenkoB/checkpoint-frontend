import {inject, Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular/standalone";
import {TranslateService} from "@shared/services/translate.service";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastController = inject(ToastController);
  private translateService = inject(TranslateService);

  async show(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'success',
    duration = 1500
  ): Promise<void> {
    const toast = await this.toastController.create({
      // message: this.translateService.instant(message), // waiting update translate service
      message,
      duration,
      color,
      position: 'top',
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  success(message: string, duration?: number): void {
    this.show(message, 'primary', duration).catch(err => console.error('Toast error:', err));
  }

  error(message: string, duration?: number): void {
    this.show(message, 'danger', duration).catch(err => console.error('Toast error:', err));
  }
}
