import { TestBed } from '@angular/core/testing';
import {commonTestProviders} from '@testing/test-providers';
import { HttpInterceptorFn } from '@angular/common/http';

import { apiInterceptor } from './api.interceptor';

describe('apiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => apiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
