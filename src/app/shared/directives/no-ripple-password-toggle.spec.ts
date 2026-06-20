import {ElementRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NoRipplePasswordToggle} from './no-ripple-password-toggle';

describe('NoRipplePasswordToggle', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [{provide: ElementRef, useValue: new ElementRef(document.createElement('ion-input-password-toggle'))}],
    });

    const directive = TestBed.runInInjectionContext(() => new NoRipplePasswordToggle());
    expect(directive).toBeTruthy();
  });
});