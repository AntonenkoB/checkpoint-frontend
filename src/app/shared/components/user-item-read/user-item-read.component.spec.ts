import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserItemReadComponent} from './user-item-read.component';
import {commonTestProviders} from '@testing/test-providers';

describe('UserItemReadComponent', () => {
  let component: UserItemReadComponent;
  let fixture: ComponentFixture<UserItemReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemReadComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemReadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
