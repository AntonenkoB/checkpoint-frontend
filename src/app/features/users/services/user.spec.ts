import { TestBed } from '@angular/core/testing';
import {commonTestProviders} from '@testing/test-providers';

import { UserService } from './user.service';

describe('User', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
