import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { SalaryService } from "./salary.service";

describe("Salary", () => {
  let service: SalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(SalaryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
