import {Component, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {DayPagerSwipeComponent} from './day-pager-swipe.component';
import {commonTestProviders} from '@testing/test-providers';

@Component({
  imports: [DayPagerSwipeComponent],
  template: `
    <cp-day-pager-swipe [days]="days()" [(activeDay)]="activeDay">
      <ng-template let-day><span class="day">{{ day }}</span></ng-template>
    </cp-day-pager-swipe>
  `
})
class HostComponent {
  public days = signal(['2026-11-12', '2026-11-10', '2026-11-11', '2026-11-11']);
  public activeDay = signal('2026-11-11');
}

describe('DayPagerSwipeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [...commonTestProviders()],
    }).compileComponents();
  });

  it('should render previous, current and next day', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();

    const days = Array.from(fixture.nativeElement.querySelectorAll('.day') as NodeListOf<HTMLElement>)
      .map((el) => el.textContent);

    expect(days).toEqual(['2026-11-10', '2026-11-11', '2026-11-12']);
  });

  it('should find neighbours when active day is not in the list', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.days.set(['2026-11-09', '2026-11-13']);
    await fixture.whenStable();

    const days = Array.from(fixture.nativeElement.querySelectorAll('.day') as NodeListOf<HTMLElement>)
      .map((el) => el.textContent);

    expect(days).toEqual(['2026-11-09', '2026-11-11', '2026-11-13']);
  });
});
