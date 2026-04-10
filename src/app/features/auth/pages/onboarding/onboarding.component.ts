import {Component, inject, OnInit, signal} from '@angular/core';
import {IonProgressBar} from "@ionic/angular/standalone";
import {AppState} from "../../../../store/app-store";
import {Store} from "@ngrx/store";
import {RouterActions} from "../../../../store/router/actions";
import {EUserPages} from "../../../users/models/user.model";
import {EAppPages} from "@models/router.model";

@Component({
  selector: 'cp-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  imports: [
    IonProgressBar
  ]
})
export class OnboardingComponent implements OnInit {
  public progress = signal(0);

  private readonly DURATION = 8000;
  private readonly INTERVAL = 50;
  private readonly STEP = this.INTERVAL / this.DURATION;
  private store = inject<Store<AppState>>(Store);

  ngOnInit() {
    setInterval(() => {
      this.progress.update(prev => prev + this.STEP);

      if (this.progress() >= 1) {
        this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]}))
        setTimeout(() => {
          this.progress.set(0);
        }, 1000);
      }
    }, this.INTERVAL);
  }
}
