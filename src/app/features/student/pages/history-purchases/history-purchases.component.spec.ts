import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HistoryPurchasesComponent} from './history-purchases.component';
import {commonTestProviders} from '@testing/test-providers';

describe('HistoryPurchasesComponent', () => {
  let component: HistoryPurchasesComponent;
  let fixture: ComponentFixture<HistoryPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPurchasesComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryPurchasesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
