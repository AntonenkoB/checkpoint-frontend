import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SalaryListComponent} from './salary-list.component';
import {commonTestProviders} from '@testing/test-providers';

describe('SalaryListComponent', () => {
  let component: SalaryListComponent;
  let fixture: ComponentFixture<SalaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryListComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
