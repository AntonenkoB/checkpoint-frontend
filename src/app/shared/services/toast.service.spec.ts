import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { ToastService } from "./toast.service";

describe("ToastService", () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(ToastService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
