import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { RatesService } from "./rates.service";

describe("Rates", () => {
  let service: RatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(RatesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
