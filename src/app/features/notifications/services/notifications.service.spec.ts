import { TestBed } from "@angular/core/testing";
import {commonTestProviders} from '@testing/test-providers';

import { NotificationsService } from "./notifications.service";

describe("MarketService", () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...commonTestProviders()] });
    service = TestBed.inject(NotificationsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
