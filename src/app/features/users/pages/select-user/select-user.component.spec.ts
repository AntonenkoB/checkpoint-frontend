import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SelectUserComponent} from './select-user.component';
import {commonTestProviders} from '@testing/test-providers';

describe('SelectUserComponent', () => {
  let component: SelectUserComponent;
  let fixture: ComponentFixture<SelectUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUserComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
