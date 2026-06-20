import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RecordTimeComponent} from './record-time.component';
import {commonTestProviders} from '@testing/test-providers';

describe('RecordTimeComponent', () => {
  let component: RecordTimeComponent;
  let fixture: ComponentFixture<RecordTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordTimeComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordTimeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
