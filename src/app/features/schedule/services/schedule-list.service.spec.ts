import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { ScheduleListService } from "./schedule-list.service";

describe("ScheduleListService", () => {
  let service: ScheduleListService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(ScheduleListService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
