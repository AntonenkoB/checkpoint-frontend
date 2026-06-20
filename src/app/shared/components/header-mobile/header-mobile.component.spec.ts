import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderMobileComponent} from './header-mobile.component';
import {commonTestProviders} from '@testing/test-providers';

describe('HeaderMobileComponent', () => {
  let component: HeaderMobileComponent;
  let fixture: ComponentFixture<HeaderMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMobileComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderMobileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
