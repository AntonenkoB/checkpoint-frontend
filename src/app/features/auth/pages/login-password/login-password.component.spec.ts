import {TestBed} from '@angular/core/testing';
import {LoginPasswordComponent} from './login-password.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginPasswordComponent', () => {
  let component: LoginPasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPasswordComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginPasswordComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});