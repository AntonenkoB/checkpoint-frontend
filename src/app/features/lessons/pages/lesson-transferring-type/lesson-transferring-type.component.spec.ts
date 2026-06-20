import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonTransferringTypeComponent} from './lesson-transferring-type.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonTransferringTypeComponent', () => {
  let component: LessonTransferringTypeComponent;
  let fixture: ComponentFixture<LessonTransferringTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonTransferringTypeComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonTransferringTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
