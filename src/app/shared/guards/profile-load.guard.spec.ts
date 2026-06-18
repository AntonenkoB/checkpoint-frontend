import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { ProfileLoadGuard } from "./profile-load.guard";

describe("profileLoadGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => ProfileLoadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
