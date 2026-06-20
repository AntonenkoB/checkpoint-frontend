import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonsPaymentComponent} from './lessons-payment.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonsPaymentComponent', () => {
  let component: LessonsPaymentComponent;
  let fixture: ComponentFixture<LessonsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsPaymentComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsPaymentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
