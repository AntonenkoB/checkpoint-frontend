import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";

import { permissionGuard } from "./permission.guard";
import {Permission} from "@shared/permissions/permissions.config";

describe("permissionGuard", () => {
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  const executeGuard = (permission: Permission | Permission[]): CanActivateFn => {
    const actualGuard = permissionGuard(permission);

    return () => TestBed.runInInjectionContext(() => actualGuard(mockRoute, mockState));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
