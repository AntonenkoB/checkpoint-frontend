import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonsSuccessComponent} from './lessons-success.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonsSuccessComponent', () => {
  let component: LessonsSuccessComponent;
  let fixture: ComponentFixture<LessonsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsSuccessComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
