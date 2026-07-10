import {TestBed} from '@angular/core/testing';
import {LoginCreatePasswordComponent} from './login-create-password.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginCreatePasswordComponent', () => {
  let component: LoginCreatePasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCreatePasswordComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginCreatePasswordComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});