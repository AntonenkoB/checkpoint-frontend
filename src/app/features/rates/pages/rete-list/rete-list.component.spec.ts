import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReteListComponent} from './rete-list.component';
import {commonTestProviders} from '@testing/test-providers';

describe('ReteListComponent', () => {
  let component: ReteListComponent;
  let fixture: ComponentFixture<ReteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReteListComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReteListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
