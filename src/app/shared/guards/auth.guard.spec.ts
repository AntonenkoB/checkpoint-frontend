import { TestBed } from '@angular/core/testing';
import {commonTestProviders} from '@testing/test-providers';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
