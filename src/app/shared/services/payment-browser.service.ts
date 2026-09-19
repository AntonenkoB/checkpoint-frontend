import {inject, Injectable} from "@angular/core";
import {Browser} from "@capacitor/browser";
import {PlatformService} from "@shared/services/platform.service";

@Injectable({
  providedIn: "root",
})
export class PaymentBrowserService {
  private platformService = inject(PlatformService);

  public async open(url: string): Promise<void> {
    if (!this.platformService.isNative) {
      window.location.href = url;
      return;
    }

    await Browser.open({url});
  }

  public async close(): Promise<void> {
    if (!this.platformService.isNative) {
      return;
    }

    try {
      await Browser.close();
    } catch (err) {
      console.warn('Browser close error:', err);
    }
  }
}