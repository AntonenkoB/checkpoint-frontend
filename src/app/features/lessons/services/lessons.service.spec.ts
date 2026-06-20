import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { LessonsService } from "./lessons.service";

describe("LessonsService", () => {
  let service: LessonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(LessonsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
