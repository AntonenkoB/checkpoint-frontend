import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { StudentService } from "./student.service";

describe("StudentService", () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(StudentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
