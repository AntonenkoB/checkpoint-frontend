import {
  afterNextRender,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  TemplateRef,
  untracked
} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";
import {
  Animation,
  createAnimation,
  createGesture,
  Gesture,
  GestureDetail,
  getTimeGivenProgression
} from "@ionic/angular/standalone";

type TPagerSwipeDirection = 1 | -1;
type TPagerSwipePosition = TPagerSwipeDirection | 0;

interface IPagerSwipeSlot {
  day: string;
  position: TPagerSwipePosition;
}

interface IPagerSwipeTarget {
  day: string;
  direction: TPagerSwipeDirection;
}

export interface IDayPagerSwipeContext {
  $implicit: string;
}

const DURATION = 350;
const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';
/** Крива для повернення панелі назад (як у свайпі «назад» Ionic) */
const EASING_CANCEL = 'cubic-bezier(1, 0, 0.68, 0.28)';
const MIN_FINISH_DURATION = 150;
/** Частка ширини, після якої дата перемикається */
const SWIPE_THRESHOLD = 0.35;
/** px/мс — швидкий свайп перемикає дату навіть до порогу */
const VELOCITY_THRESHOLD = 0.3;
/** Не стартувати від лівого краю — там системний свайп «назад» на iOS */
const EDGE_GUARD = 50;
/** Наскільки панель «тягнеться», якщо сусідньої дати немає */
const RUBBER_BAND = 0.25;
const PANEL_SCALE = 0.96;
const PANEL_OPACITY = 0.6;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

@Component({
  selector: "cp-day-pager-swipe",
  templateUrl: "./day-pager-swipe.component.html",
  styleUrls: ["./day-pager-swipe.component.scss"],
  imports: [
    NgTemplateOutlet
  ],
  host: {
    '[class.is-dragging]': 'isDragging()'
  }
})
export class DayPagerSwipeComponent {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private injector = inject(Injector);

  public days = input.required<string[]>();
  public activeDay = model.required<string>();
  public locked = input(false);
  public canChange = input<(day: string) => boolean>(() => true);
  public panelTemplate = contentChild.required<TemplateRef<IDayPagerSwipeContext>>(TemplateRef);

  private shownDay = signal<string>('');
  /** Дата, підставлена в сусідній слот для переходу ззовні (не через свайп) */
  private target = signal<IPagerSwipeTarget | null>(null);
  public isDragging = signal(false);

  private sortedDays = computed(() => [...new Set(this.days())].sort());

  public slots = computed<IPagerSwipeSlot[]>(() => {
    const day = this.shownDay();
    const target = this.target();

    if (!day) {
      return [];
    }

    const prev = target?.direction === -1 ? target.day : this.findNeighbour(day, -1);
    const next = target?.direction === 1 ? target.day : this.findNeighbour(day, 1);

    const slots: IPagerSwipeSlot[] = [];
    if (prev) {
      slots.push({day: prev, position: -1});
    }
    slots.push({day, position: 0});
    if (next) {
      slots.push({day: next, position: 1});
    }
    return slots;
  });

  private gesture?: Gesture;
  private animation?: Animation;
  private dragDirection: TPagerSwipeDirection | null = null;
  private isAnimating = false;
  private width = 0;

  constructor() {
    effect(() => {
      const day = this.activeDay();
      untracked(() => this.onActiveDayChange(day));
    });

    afterNextRender(() => this.initGesture());

    inject(DestroyRef).onDestroy(() => {
      this.gesture?.destroy();
      this.animation?.destroy();
    });
  }

  private findNeighbour(day: string, direction: TPagerSwipeDirection): string | null {
    const days = this.sortedDays();

    // Порівняння, а не indexOf: поточної дати може не бути в списку (наприклад, сьогодні недоступне)
    if (direction === 1) {
      return days.find((item) => item > day) ?? null;
    }

    const earlier = days.filter((item) => item < day);
    return earlier.length ? earlier[earlier.length - 1] : null;
  }

  // --- Зміна дати ззовні ---

  private onActiveDayChange(day: string): void {
    const shown = this.shownDay();

    if (!shown) {
      this.shownDay.set(day);
      return;
    }

    if (day === shown) {
      return;
    }

    // Нова зміна посеред анімації — без анімації переходимо одразу на неї
    if (this.isAnimating || this.dragDirection !== null) {
      this.resetAnimation();
      this.isDragging.set(false);
      this.target.set(null);
      this.shownDay.set(day);
      return;
    }

    const direction: TPagerSwipeDirection = day > shown ? 1 : -1;
    this.target.set({day, direction});
    this.isAnimating = true;

    // Чекаємо, поки цільова панель з'явиться в DOM
    afterNextRender(() => {
      this.animation = this.buildAnimation(direction);
      this.animation.onFinish(() => this.commit(day), {oneTimeCallback: true});
      this.animation.play();
    }, {injector: this.injector});
  }

  // --- Жест ---

  private initGesture(): void {
    this.gesture = createGesture({
      el: this.host.nativeElement,
      gestureName: 'cp-day-pager-swipe',
      direction: 'x',
      threshold: 10,
      maxAngle: 25,
      canStart: (detail) => !this.locked() && !this.isAnimating && detail.startX > EDGE_GUARD,
      onStart: () => this.onStart(),
      onMove: (detail) => this.onMove(detail),
      onEnd: (detail) => this.onEnd(detail),
    });
    this.gesture.enable(true);
  }

  private onStart(): void {
    this.width = this.host.nativeElement.clientWidth || 1;
    this.dragDirection = null;
    this.isDragging.set(true);
  }

  private onMove({deltaX}: GestureDetail): void {
    if (deltaX === 0) {
      return;
    }

    // Свайп вліво → наступна дата, вправо → попередня
    const direction: TPagerSwipeDirection = deltaX < 0 ? 1 : -1;

    if (direction !== this.dragDirection) {
      this.animation?.destroy();
      this.dragDirection = direction;
      this.animation = this.buildAnimation(direction);
      this.animation.progressStart(true);
    }

    this.animation?.progressStep(clamp(Math.abs(deltaX) / this.width, 0, 0.9999));
  }

  private onEnd({deltaX, velocityX}: GestureDetail): void {
    const direction = this.dragDirection;
    const animation = this.animation;

    if (direction === null || !animation) {
      this.isDragging.set(false);
      return;
    }

    const neighbour = this.findNeighbour(this.shownDay(), direction);
    const progress = clamp(Math.abs(deltaX) / this.width, 0, 0.9999);

    // velocityX < 0 — рух вліво, тобто до наступної дати
    const isFastSwipe = Math.abs(velocityX) > VELOCITY_THRESHOLD && Math.sign(-velocityX) === direction;
    const shouldCommit = !!neighbour
      && (progress > SWIPE_THRESHOLD || isFastSwipe)
      && this.canChange()(neighbour);

    // Під час жесту анімація лінійна; переводимо прогрес у час на кривій, щоб не було стрибка
    let step: number;
    if (shouldCommit) {
      step = getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], progress)[0] ?? progress;
    } else {
      animation.easing(EASING_CANCEL);
      step = getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], progress)[0] ?? progress;
    }

    const duration = Math.max(MIN_FINISH_DURATION, DURATION * (shouldCommit ? 1 - progress : progress));

    this.isAnimating = true;
    animation.onFinish(() => {
      this.dragDirection = null;
      this.isDragging.set(false);

      if (shouldCommit && neighbour) {
        this.commit(neighbour);
      } else {
        this.resetAnimation();
      }
    }, {oneTimeCallback: true});
    animation.progressEnd(shouldCommit ? 1 : 0, step, duration);
  }

  // --- Анімація ---

  private buildAnimation(direction: TPagerSwipeDirection): Animation {
    const current = this.panel(0);
    const incoming = this.panel(direction);

    const root = createAnimation()
      .duration(DURATION)
      .easing(EASING)
      .fill('both');

    if (!current) {
      return root;
    }

    // Сусідньої дати немає — панель лише трохи тягнеться і повертається
    if (!incoming) {
      return root.addAnimation(
        createAnimation()
          .addElement(current)
          .fromTo('transform', 'translateX(0)', `translateX(${-direction * RUBBER_BAND * 100}%)`)
      );
    }

    return root.addAnimation([
      createAnimation()
        .addElement(current)
        .fromTo('transform', 'translateX(0) scale(1)', `translateX(${-direction * 100}%) scale(${PANEL_SCALE})`)
        .fromTo('opacity', '1', `${PANEL_OPACITY}`),
      createAnimation()
        .addElement(incoming)
        .fromTo('transform', `translateX(${direction * 100}%) scale(${PANEL_SCALE})`, 'translateX(0) scale(1)')
        .fromTo('opacity', `${PANEL_OPACITY}`, '1'),
    ]);
  }

  private panel(position: TPagerSwipePosition): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>(`.day-pager-swipe-panel[data-position="${position}"]`);
  }

  private commit(day: string): void {
    this.target.set(null);
    this.shownDay.set(day);
    this.activeDay.set(day);

    // Знімаємо анімацію лише після того, як панелі отримали нові позиції, — інакше буде миготіння
    afterNextRender(() => this.resetAnimation(), {injector: this.injector});
  }

  private resetAnimation(): void {
    this.animation?.destroy();
    this.animation = undefined;
    this.isAnimating = false;
  }
}
