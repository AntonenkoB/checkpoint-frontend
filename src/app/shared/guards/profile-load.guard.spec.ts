import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';
import { CanActivateFn } from "@angular/router";

import { ProfileLoadGuard } from "./profile-load.guard";

describe("profileLoadGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => ProfileLoadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
