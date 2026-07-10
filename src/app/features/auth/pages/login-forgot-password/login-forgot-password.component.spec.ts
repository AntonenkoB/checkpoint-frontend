import {TestBed} from '@angular/core/testing';
import {LoginForgotPasswordComponent} from './login-forgot-password.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginForgotPasswordComponent', () => {
  let component: LoginForgotPasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForgotPasswordComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginForgotPasswordComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});