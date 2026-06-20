import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RecordStudentItemComponent} from './record-student-item.component';
import {commonTestProviders} from '@testing/test-providers';

describe('RecordStudentItemComponent', () => {
  let component: RecordStudentItemComponent;
  let fixture: ComponentFixture<RecordStudentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordStudentItemComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordStudentItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
