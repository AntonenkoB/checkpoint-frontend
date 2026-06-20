import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { HapticService } from "./haptic.service";

describe("HapticService", () => {
  let service: HapticService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(HapticService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
