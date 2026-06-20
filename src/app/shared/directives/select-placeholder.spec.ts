import {ElementRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SelectPlaceholder} from './select-placeholder';

describe('SelectPlaceholder', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [{provide: ElementRef, useValue: new ElementRef(document.createElement('div'))}],
    });

    const directive = TestBed.runInInjectionContext(() => new SelectPlaceholder());
    expect(directive).toBeTruthy();
  });
});