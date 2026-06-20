import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonActionStatusComponent} from './lesson-action-status.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonActionStatusComponent', () => {
  let component: LessonActionStatusComponent;
  let fixture: ComponentFixture<LessonActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonActionStatusComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonActionStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
