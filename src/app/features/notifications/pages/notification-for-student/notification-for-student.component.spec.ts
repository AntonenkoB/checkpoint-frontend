import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationForStudentComponent } from "./notification-for-student.component";

describe("NotificationComponent", () => {
  let component: NotificationForStudentComponent;
  let fixture: ComponentFixture<NotificationForStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationForStudentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationForStudentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
