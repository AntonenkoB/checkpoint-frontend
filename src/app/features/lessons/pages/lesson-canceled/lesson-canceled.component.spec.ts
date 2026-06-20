import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonCanceledComponent} from './lesson-canceled.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonCanceledComponent', () => {
  let component: LessonCanceledComponent;
  let fixture: ComponentFixture<LessonCanceledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCanceledComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonCanceledComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
