import { Directive, ElementRef, HostListener, inject, OnInit, DoCheck } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';

@Directive({
  selector: '[cpPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective implements OnInit, DoCheck {
  private ionInput = inject(IonInput);
  private el = inject(ElementRef);
  private isUpdating = false;
  private lastValue: string | null | undefined = null;

  public ngOnInit(): void {
    setTimeout(() => {
      if (!this.ionInput.value) {
        this.updateValue('+380 ');
      }
    }, 150);
  }

  public ngDoCheck(): void {
    if (this.isUpdating) return;
    
    const val = (this.ionInput.value as string) || '';
    if (val !== this.lastValue) {
      this.applyMask(val);
    }
  }

  @HostListener('ionInput', ['$event'])
  public onInput(event: any): void {
    if (this.isUpdating) return;
    
    const val = (event.detail.value as string) || '';
    this.applyMask(val);
  }

  private applyMask(val: string): void {
    const formatted = this.formatValue(val);
    this.lastValue = formatted;
    
    if (val !== formatted) {
      this.updateValue(formatted);
    }
  }

  private formatValue(val: string): string {
    if (!val || val.length < 4) {
      return '+380 ';
    }

    let digits = val.replace(/\D/g, '');

    if (digits.startsWith('380')) {
      digits = digits.substring(3);
    } else if (digits.startsWith('80')) {
      digits = digits.substring(2);
    } else if (digits.startsWith('0')) {
      digits = digits.substring(1); 
    } else if (digits.length <= 3) {
      digits = '';
    }

    digits = digits.substring(0, 9);

    let formatted = '+380 ';
    if (digits.length > 0) formatted += digits.substring(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.substring(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.substring(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.substring(7, 9);

    return formatted;
  }

  @HostListener('ionFocus')
  public onFocus(): void {
    if (!this.ionInput.value) {
      this.updateValue('+380 ');
    }
  }

  private updateValue(val: string): void {
    this.isUpdating = true;
    this.ionInput.value = val;

    this.ionInput.getInputElement().then(nativeInput => {
      if (nativeInput && nativeInput.value !== val) {
        nativeInput.value = val;
      }
      
      this.el.nativeElement.dispatchEvent(new CustomEvent('ionInput', {
        detail: { value: val },
        bubbles: true,
        composed: true
      }));

      this.isUpdating = false;
    });
  }
}
