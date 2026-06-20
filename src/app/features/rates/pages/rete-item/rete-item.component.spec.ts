import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReteItemComponent} from './rete-item.component';
import {commonTestProviders} from '@testing/test-providers';

describe('ReteItemComponent', () => {
  let component: ReteItemComponent;
  let fixture: ComponentFixture<ReteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReteItemComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReteItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
