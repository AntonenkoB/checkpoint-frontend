import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaymentSuccessComponent} from './payment-success.component';
import {commonTestProviders} from '@testing/test-providers';

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuccessComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
