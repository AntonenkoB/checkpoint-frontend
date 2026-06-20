import {ChangeDetectorRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {TranslatePipe} from './translate-pipe';
import {commonTestProviders} from '@testing/test-providers';

describe('TranslatePipe', () => {
  it('create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        ...commonTestProviders(),
        {provide: ChangeDetectorRef, useValue: {markForCheck: () => {}}},
      ],
    });

    const pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
    expect(pipe).toBeTruthy();
  });
});