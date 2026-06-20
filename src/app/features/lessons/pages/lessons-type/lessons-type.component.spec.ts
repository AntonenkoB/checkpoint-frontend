import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonsTypeComponent} from './lessons-type.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonsTypeComponent', () => {
  let component: LessonsTypeComponent;
  let fixture: ComponentFixture<LessonsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsTypeComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
