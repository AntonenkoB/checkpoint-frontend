import {TemplateRef, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {CheckPermission} from './check-permission';
import {commonTestProviders} from '@testing/test-providers';

describe('CheckPermission', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        ...commonTestProviders(),
        {provide: TemplateRef, useValue: {}},
        {provide: ViewContainerRef, useValue: {createEmbeddedView: () => {}, clear: () => {}}},
      ],
    });

    const directive = TestBed.runInInjectionContext(() => new CheckPermission());
    expect(directive).toBeTruthy();
  });
});