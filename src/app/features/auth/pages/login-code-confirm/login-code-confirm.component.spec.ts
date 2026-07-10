import {TestBed} from '@angular/core/testing';
import {LoginCodeConfirmComponent} from './login-code-confirm.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginCodeConfirmComponent', () => {
  let component: LoginCodeConfirmComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCodeConfirmComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginCodeConfirmComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});