import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonInput, IonItem} from '@ionic/angular/standalone';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthFacade} from '../../facade/auth.facade';
import {TranslatePipe} from '@shared/pipes/translate-pipe';
import {LOGO_SVG} from '@models/svg.models';

@Component({
  selector: 'cp-login-identifier',
  templateUrl: './login-identifier.component.html',
  styleUrls: ['./login-identifier.component.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonItem, IonInput, IonButton, TranslatePipe],
})
export class LoginIdentifierComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly sanitizer = inject(DomSanitizer);

  public readonly name = signal('');
  public readonly checkUserFailure = this.authFacade.checkUserFailure;

  protected readonly LOGO_SVG = this.sanitizer.bypassSecurityTrustHtml(LOGO_SVG);

  public changeName(name: string): void {
    if (this.checkUserFailure()) {
      this.authFacade.clearCheckUserFailure();
    }

    this.name.set(name);
  }

  public send(): void {
    this.authFacade.checkUser(this.name());
  }
}