import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RecordStudentComponent} from './record-student.component';
import {commonTestProviders} from '@testing/test-providers';

describe('RecordStudentComponent', () => {
  let component: RecordStudentComponent;
  let fixture: ComponentFixture<RecordStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordStudentComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordStudentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
