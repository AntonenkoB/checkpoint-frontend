import {TestBed} from '@angular/core/testing';
import {LoginResetPasswordComponent} from './login-reset-password.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginResetPasswordComponent', () => {
  let component: LoginResetPasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginResetPasswordComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginResetPasswordComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});