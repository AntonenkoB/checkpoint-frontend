import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HistoryLessonsComponent} from './history-lessons.component';
import {commonTestProviders} from '@testing/test-providers';

describe('HistoryLessonsComponent', () => {
  let component: HistoryLessonsComponent;
  let fixture: ComponentFixture<HistoryLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryLessonsComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryLessonsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
