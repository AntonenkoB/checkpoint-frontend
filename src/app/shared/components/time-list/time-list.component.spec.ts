import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TimeListComponent} from './time-list.component';
import {commonTestProviders} from '@testing/test-providers';

describe('TimeListComponent', () => {
  let component: TimeListComponent;
  let fixture: ComponentFixture<TimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeListComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
