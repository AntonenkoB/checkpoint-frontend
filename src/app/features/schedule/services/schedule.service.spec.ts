import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { ScheduleService } from "./schedule.service";

describe("Rates", () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(ScheduleService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
