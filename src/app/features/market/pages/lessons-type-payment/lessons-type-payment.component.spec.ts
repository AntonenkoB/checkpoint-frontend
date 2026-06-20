import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LessonsTypePaymentComponent} from './lessons-type-payment.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LessonsTypePaymentComponent', () => {
  let component: LessonsTypePaymentComponent;
  let fixture: ComponentFixture<LessonsTypePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsTypePaymentComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsTypePaymentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
