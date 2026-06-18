import {Component, effect, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {IonIcon, IonProgressBar} from "@ionic/angular/standalone";
import {AppState} from "../../../../store/app-store";
import {Store} from "@ngrx/store";
import {Capacitor} from "@capacitor/core";
import {RouterActions} from "../../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {addIcons} from "ionicons";
import {SOUND_ICONS} from "@models/form.models";
import {EStudentPages} from "@student/models/student.model";
import {DomSanitizer} from "@angular/platform-browser";
import {SOUND_OFF_SVG, SOUND_SVG} from "@models/svg.models";

@Component({
  selector: 'cp-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  imports: [
    IonProgressBar,
    IonIcon
  ]
})
export class OnboardingComponent implements OnInit {
  public progress = signal(0);
  public readonly sanitizer = inject(DomSanitizer);

  private readonly DURATION = 5000;
  private readonly INTERVAL = 50;
  private readonly STEP = this.INTERVAL / this.DURATION;
  private store = inject<Store<AppState>>(Store);
  private videoElement = viewChild<ElementRef<HTMLVideoElement>>('onboardingVideo');
  protected isMuted = signal(true);
  public SOUND_SVG = this.sanitizer.bypassSecurityTrustHtml(SOUND_SVG);
  public SOUND_OFF_SVG = this.sanitizer.bypassSecurityTrustHtml(SOUND_OFF_SVG);

  protected videoSrc = signal(
    Capacitor.convertFileSrc('assets/img/onboarding.MP4')
  );

  constructor() {
    addIcons(SOUND_ICONS);

    effect(() => {
      const video = this.videoElement()?.nativeElement;
      if (!video) return;

      video.muted = false;
      video.playsInline = true;

      video.play().catch();
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.progress.update(prev => prev + this.STEP);

      if (this.progress() >= 1) {
        this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student, EStudentPages.StudentDashboard]}))
        setTimeout(() => {
          this.progress.set(0);
        }, 1000);
      }
    }, this.INTERVAL);
  }

  ionViewDidEnter() {
    const video = this.videoElement()?.nativeElement;
    if (video) {
      video.play().then();
    }
  }

  protected toggleMute() {
    const video = this.videoElement()?.nativeElement;

    if (video) {
      video.muted = !video.muted;
      this.isMuted.update((mute) => !mute);
    }
  }
}
