import {TestBed} from '@angular/core/testing';
import {TouchFeedbackDirective} from '@shared/directives/touch-feedback';
import {commonTestProviders} from '@testing/test-providers';

describe('TouchFeedback', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({providers: [...commonTestProviders()]});

    const directive = TestBed.runInInjectionContext(() => new TouchFeedbackDirective());
    expect(directive).toBeTruthy();
  });
});