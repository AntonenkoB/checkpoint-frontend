import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderSecondaryComponent} from './header-secondary.component';
import {commonTestProviders} from '@testing/test-providers';

describe('HeaderSecondaryComponent', () => {
  let component: HeaderSecondaryComponent;
  let fixture: ComponentFixture<HeaderSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSecondaryComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSecondaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
