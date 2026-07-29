import { LessonDateTimePipe } from "./lesson-date-time-pipe";

describe("LessonDateTimePipe", () => {
  it("create an instance", () => {
    const pipe = new LessonDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});
