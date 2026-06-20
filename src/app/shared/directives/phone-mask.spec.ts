import {ElementRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {IonInput} from '@ionic/angular/standalone';
import {PhoneMaskDirective} from '@shared/directives/phone-mask';

describe('PhoneMask', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ElementRef, useValue: new ElementRef(document.createElement('ion-input'))},
        {provide: IonInput, useValue: {value: '', getInputElement: () => Promise.resolve(null)}},
      ],
    });

    const directive = TestBed.runInInjectionContext(() => new PhoneMaskDirective());
    expect(directive).toBeTruthy();
  });
});