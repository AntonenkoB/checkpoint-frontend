import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LessonTransferringTypeComponent } from "./lesson-transferring-type.component";

describe("LessonTransferringTypeComponent", () => {
  let component: LessonTransferringTypeComponent;
  let fixture: ComponentFixture<LessonTransferringTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LessonTransferringTypeComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonTransferringTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
