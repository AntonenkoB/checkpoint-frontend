import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IndividualLessonComponent } from "./individual-lesson.component";

describe("IndividualLessonComponent", () => {
  let component: IndividualLessonComponent;
  let fixture: ComponentFixture<IndividualLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualLessonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualLessonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
