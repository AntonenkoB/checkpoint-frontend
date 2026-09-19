import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {App, AppState} from "@capacitor/app";
import {PluginListenerHandle} from "@capacitor/core";
import {PlatformService} from "@shared/services/platform.service";
import {PaymentBrowserService} from "@shared/services/payment-browser.service";
import {parseDeepLink, resolveDeepLinkRoute} from "@models/deep-link.model";
import {RouterActions} from "../../store/router/actions";

@Injectable({
  providedIn: "root",
})
export class DeepLinkService {
  private store = inject<Store<AppState>>(Store);
  private platformService = inject(PlatformService);
  private paymentBrowser = inject(PaymentBrowserService);

  private listener?: PluginListenerHandle;

  public async init(): Promise<void> {
    if (!this.platformService.isNative || this.listener) {
      return;
    }

    this.listener = await App.addListener('appUrlOpen', ({url}) => void this.handleUrl(url));

    const {url} = await App.getLaunchUrl() ?? {};

    if (url) {
      void this.handleUrl(url);
    }
  }

  private async handleUrl(url: string): Promise<void> {
    const link = parseDeepLink(url);

    if (!link) {
      return;
    }

    await this.paymentBrowser.close();

    const route = resolveDeepLinkRoute(link);

    if (!route) {
      return;
    }

    this.store.dispatch(RouterActions.goTo(route));
  }
}