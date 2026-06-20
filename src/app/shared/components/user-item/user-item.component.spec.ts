import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserItemComponent} from './user-item.component';
import {commonTestProviders} from '@testing/test-providers';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
