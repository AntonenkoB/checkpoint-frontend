import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonInputOtp, ToastController} from '@ionic/angular/standalone';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject, throttleTime} from 'rxjs';

import {AuthFacade} from '../../facade/auth.facade';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {BACK_SVG, LOGO_SVG} from '@models/svg.models';
import {TranslateService} from "@shared/services/translate.service";

@Component({
  selector: 'cp-login-code-confirm',
  templateUrl: './login-code-confirm.component.html',
  styleUrls: ['./login-code-confirm.component.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonInputOtp, IonButton, TranslatePipe],
})
export class LoginCodeConfirmComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toastController = inject(ToastController);
  private readonly translateService = inject(TranslateService);

  public readonly codeConfirm = signal('');

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);
  protected readonly BACK_SVG = this.sanitizer.bypassSecurityTrustHtml(BACK_SVG);

  private readonly sendCodeSubject = new Subject<void>();

  constructor() {
    this.sendCodeSubject.pipe(
      throttleTime(10000),
      takeUntilDestroyed(),
    ).subscribe(() => {
      void this.executeSendNewCode();
    });
  }

  public changeCodeConfirm(code: string): void {
    this.codeConfirm.set(code);
  }

  public sendNewCode(): void {
    this.sendCodeSubject.next();
  }

  public goBack(): void {
    this.authFacade.backToForgotPassword();
  }

  public send(): void {
    this.authFacade.codeConfirm(this.codeConfirm());
  }

  private async executeSendNewCode(): Promise<void> {
    this.authFacade.codeConfirm(this.codeConfirm());

    const toast = await this.toastController.create({
      message: this.translateService.instant('login.code-sent'),
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }
}