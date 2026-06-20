import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarShortComponent} from './calendar-short.component';
import {commonTestProviders} from '@testing/test-providers';

describe('CalendarShortComponent', () => {
  let component: CalendarShortComponent;
  let fixture: ComponentFixture<CalendarShortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarShortComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarShortComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
