import { Animation, AnimationBuilder, createAnimation } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

type TransitionOpts = Parameters<AnimationBuilder>[1];

const hideLeavingOnBack = (root: Animation, opts: TransitionOpts): void => {
  const leavingEl: HTMLElement | undefined = opts.leavingEl;
  if (opts.direction !== 'back' || !leavingEl) {
    return;
  }

  root.afterAddWrite(() => {
    if (root.getDirection() === 'normal') {
      leavingEl.style.setProperty('display', 'none');
    }
  });
};

const iosAnimation: AnimationBuilder = (baseEl, opts) => {
  const isForward = opts.direction === 'forward';
  const offset = Math.round(window.innerWidth * 0.3);

  const enterAnim = createAnimation()
    .addElement(opts.enteringEl)
    .fromTo('opacity', '0.01', '1')
    .fromTo('transform', `translateX(${isForward ? offset : -offset}px)`, 'translateX(0)');

  const leaveAnim = createAnimation()
    .addElement(opts.leavingEl)
    .fromTo('opacity', '1', '0.01')
    .fromTo('transform', 'translateX(0)', `translateX(${isForward ? -offset : offset}px)`);

  const root = createAnimation()
    .duration(350)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .addAnimation([enterAnim, leaveAnim]);

  hideLeavingOnBack(root, opts);

  return root;
};

const androidAnimation: AnimationBuilder = (baseEl, opts) => {
  const isForward = opts.direction === 'forward';

  const enterAnim = createAnimation()
    .addElement(opts.enteringEl)
    .duration(300)
    .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
    .fromTo('opacity', '0', '1')
    .fromTo('transform', `scale(${isForward ? '0.95' : '1.05'})`, 'scale(1)');

  const leaveAnim = createAnimation()
    .addElement(opts.leavingEl)
    .duration(250)
    .easing('cubic-bezier(0.4, 0.0, 1, 1)')
    .fromTo('opacity', '1', '0')
    .fromTo('transform', 'scale(1)', `scale(${isForward ? '1.05' : '0.95'})`);

  const root = createAnimation().addAnimation([enterAnim, leaveAnim]);

  hideLeavingOnBack(root, opts);

  return root;
};

export const pageAnimation: AnimationBuilder = (baseEl, opts) => {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    return createAnimation(); // без анімації
  }

  if (platform === 'ios') {
    return iosAnimation(baseEl, opts);
  }

  return androidAnimation(baseEl, opts);
};