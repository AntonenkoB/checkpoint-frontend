import {inject, Injectable} from "@angular/core";
import {Platform} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private platform = inject(Platform);

  public isIos = this.platform.is('ios');
  public isAndroid = this.platform.is('android');
  public isMobile = this.platform.is('mobile');
  public isDesktop = this.platform.is('desktop');

  public isNative = Capacitor.isNativePlatform();

  public hasCamera = () => Capacitor.isPluginAvailable('Camera');
}