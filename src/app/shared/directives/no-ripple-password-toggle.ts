import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: 'ion-input-password-toggle[noRipple]'
})
export class NoRipplePasswordToggle implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => {
      const ionBtn = this.el.nativeElement.shadowRoot?.querySelector('ion-button');
      if (ionBtn) {
        ionBtn.style.setProperty('--ripple-color', 'transparent');
        ionBtn.style.setProperty('--background-activated-opacity', '0');
        ionBtn.style.setProperty('--background-focused-opacity', '0');
        ionBtn.style.setProperty('--background-hover-opacity', '0');
        ionBtn.style.setProperty('min-height', '31px');
      }
    }, 100);
  }
}
