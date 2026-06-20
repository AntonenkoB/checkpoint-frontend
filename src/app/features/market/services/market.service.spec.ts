import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { MarketService } from "./market.service";

describe("MarketService", () => {
  let service: MarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(MarketService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
