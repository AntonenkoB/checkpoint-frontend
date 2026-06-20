import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SelectTeacherComponent} from './select-teacher.component';
import {commonTestProviders} from '@testing/test-providers';

describe('SelectTeacherComponent', () => {
  let component: SelectTeacherComponent;
  let fixture: ComponentFixture<SelectTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTeacherComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTeacherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
