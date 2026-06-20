import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonTransferringSuccessComponent} from './lesson-transferring-success.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonTransferringSuccessComponent', () => {
  let component: LessonTransferringSuccessComponent;
  let fixture: ComponentFixture<LessonTransferringSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonTransferringSuccessComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonTransferringSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
