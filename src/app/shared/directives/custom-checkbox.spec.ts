import {ElementRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {CustomCheckbox} from './custom-checkbox';

describe('CustomCheckbox', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [{provide: ElementRef, useValue: new ElementRef(document.createElement('ion-checkbox'))}],
    });

    const directive = TestBed.runInInjectionContext(() => new CustomCheckbox());
    expect(directive).toBeTruthy();
  });
});