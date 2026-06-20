import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SalaryItemComponent} from './salary-item.component';
import {commonTestProviders} from '@testing/test-providers';

describe('SalaryItemComponent', () => {
  let component: SalaryItemComponent;
  let fixture: ComponentFixture<SalaryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryItemComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
