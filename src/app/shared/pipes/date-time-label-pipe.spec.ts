import { DateTimeLabelPipe } from "./date-time-label-pipe";

describe("DateTimeLabelPipe", () => {
  it("create an instance", () => {
    const pipe = new DateTimeLabelPipe();
    expect(pipe).toBeTruthy();
  });
});
