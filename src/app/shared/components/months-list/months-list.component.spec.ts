import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MonthsListComponent} from './months-list.component';
import {commonTestProviders} from '@testing/test-providers';

describe('MonthsListComponent', () => {
  let component: MonthsListComponent;
  let fixture: ComponentFixture<MonthsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthsListComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
