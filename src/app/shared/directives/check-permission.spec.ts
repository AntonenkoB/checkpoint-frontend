import { CheckPermission } from "./check-permission";

describe("CheckPermission", () => {
  it("should create an instance", () => {
    const directive = new CheckPermission();
    expect(directive).toBeTruthy();
  });
});
