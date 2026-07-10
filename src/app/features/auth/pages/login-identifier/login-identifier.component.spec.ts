import {TestBed} from '@angular/core/testing';
import {LoginIdentifierComponent} from './login-identifier.component';
import {commonTestProviders} from '@testing/test-providers';

describe('LoginIdentifierComponent', () => {
  let component: LoginIdentifierComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginIdentifierComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    component = TestBed.createComponent(LoginIdentifierComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});