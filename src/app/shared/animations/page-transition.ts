import { AnimationBuilder, createAnimation } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

const iosAnimation: AnimationBuilder = (baseEl, opts) => {
  const isForward = opts.direction === 'forward';
  const offset = Math.round(window.innerWidth * 0.3);

  const enterAnim = createAnimation()
    .addElement(opts.enteringEl)
    .duration(350)
    .easing('cubic-bezier(0.36, 0.66, 0.04, 1)')
    .fromTo('opacity', '0.01', '1')
    .fromTo('transform', `translateX(${isForward ? offset : -offset}px)`, 'translateX(0)');

  const leaveAnim = createAnimation()
    .addElement(opts.leavingEl)
    .duration(350)
    .easing('cubic-bezier(0.36, 0.66, 0.04, 1)')
    .fromTo('opacity', '1', '0.01')
    .fromTo('transform', 'translateX(0)', `translateX(${isForward ? -offset : offset}px)`);

  return createAnimation().addAnimation([enterAnim, leaveAnim]);
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

  return createAnimation().addAnimation([enterAnim, leaveAnim]);
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