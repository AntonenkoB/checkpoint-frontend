import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LessonTransferringSuccessComponent } from "./lesson-transferring-success.component";

describe("LessonTransferringSuccessComponent", () => {
  let component: LessonTransferringSuccessComponent;
  let fixture: ComponentFixture<LessonTransferringSuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LessonTransferringSuccessComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonTransferringSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
