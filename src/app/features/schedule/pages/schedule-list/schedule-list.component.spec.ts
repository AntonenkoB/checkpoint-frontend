import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ScheduleListComponent} from './schedule-list.component';
import {commonTestProviders} from '@testing/test-providers';

describe('ScheduleListComponent', () => {
  let component: ScheduleListComponent;
  let fixture: ComponentFixture<ScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleListComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
