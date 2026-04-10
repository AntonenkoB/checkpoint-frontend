import {Component, inject, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {CommonActions} from "./store/common/actions";
import {Store} from "@ngrx/store";
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {Capacitor} from "@capacitor/core";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  public ngOnInit() {
    this.store.dispatch(CommonActions.initialize());

    if (Capacitor.isNativePlatform()) {
      void ScreenOrientation.lock({
        orientation: 'portrait'
      });
    }
  }
}
