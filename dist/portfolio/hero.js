(() => {
  'use strict';
  const hero = document.querySelector('.p-hero');
  if (!hero) return;
  const sky = hero.querySelector('#portfolio-sky-video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videoSource = sky.getAttribute('src');
  let heroVisible = true;
  let animations = [];
  let entranceFinished = false;
  let interactionRetryAttached = false;

  const finishEntrance = () => {
    if (entranceFinished) return;
    entranceFinished = true;
    window.clearTimeout(window.__mattHeroEntranceTimeout);
    document.documentElement.classList.remove('p-hero-entrance-pending');
    document.documentElement.classList.add('p-hero-entrance-complete');
    animations.forEach((animation) => animation.cancel());
    animations = [];
    window.__mattFinishHeroEntrance = null;
  };
  window.__mattFinishHeroEntrance = finishEntrance;

  const shouldPlay = () => heroVisible && !document.hidden && !reduceMotion.matches;
  const retryAfterInteraction = () => {
    document.removeEventListener('pointerdown', retryAfterInteraction);
    document.removeEventListener('touchstart', retryAfterInteraction);
    interactionRetryAttached = false;
    if (shouldPlay()) sky.play().catch(() => {});
  };
  const attachInteractionRetry = () => {
    if (interactionRetryAttached) return;
    interactionRetryAttached = true;
    document.addEventListener('pointerdown', retryAfterInteraction, { once: true });
    document.addEventListener('touchstart', retryAfterInteraction, { once: true, passive: true });
  };
  const playSky = () => {
    if (!shouldPlay()) return;
    const playback = sky.play();
    if (playback && typeof playback.catch === 'function') playback.catch(attachInteractionRetry);
  };
  const updatePlayback = () => {
    hero.classList.toggle('p-hero-is-idle', !shouldPlay());
    if (shouldPlay()) playSky();
    else sky.pause();
  };
  const configureMotion = () => {
    if (reduceMotion.matches) {
      finishEntrance();
      sky.removeAttribute('autoplay');
      sky.pause();
      sky.classList.remove('is-playing');
      sky.removeAttribute('src');
      sky.load();
    } else {
      if (!sky.getAttribute('src')) {
        sky.src = videoSource;
        sky.load();
      }
      sky.loop = false;
    }
    updatePlayback();
  };
  const revealSky = () => { if (!reduceMotion.matches) sky.classList.add('is-playing'); };
  const rewindSky = () => {
    if (!shouldPlay()) return;
    try { sky.currentTime = 3; } catch (_) { /* Metadata may not yet permit seeking. */ }
    if (sky.paused) playSky();
  };
  sky.addEventListener('playing', revealSky);
  sky.addEventListener('error', () => sky.classList.remove('is-playing'));
  sky.addEventListener('ended', rewindSky);
  sky.addEventListener('timeupdate', () => {
    if (sky.duration && sky.currentTime >= sky.duration - .25) rewindSky();
  });
  if (sky.readyState >= 3) revealSky();
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updatePlayback();
    }, { threshold: 0 });
    visibility.observe(hero);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  reduceMotion.addEventListener('change', configureMotion);
  configureMotion();

  if (reduceMotion.matches || typeof Element.prototype.animate !== 'function') {
    finishEntrance();
    return;
  }
  requestAnimationFrame(() => {
    if (entranceFinished) return;
    const designUnit = parseFloat(getComputedStyle(hero.querySelector('.p-hero-scene')).width) / 1116;
    const typeUnit = parseFloat(getComputedStyle(hero.querySelector('.p-hero-hi')).fontSize) / 28.5;
    const enter = (selector, frames, duration, delay, easing = 'cubic-bezier(.22,1,.36,1)') => {
      const target = hero.querySelector(selector);
      if (target) animations.push(target.animate(frames, { duration, delay, easing, fill: 'both' }));
    };
    enter('.p-hero-hi', [{ opacity: 0, translate: `0 ${7 * typeUnit}px` }, { opacity: 1, translate: '0 0' }], 520, 40);
    enter('.p-hero-name', [{ opacity: 0, translate: `0 ${15 * typeUnit}px`, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, translate: '0 0', clipPath: 'inset(0 0 0 0)' }], 760, 135, 'cubic-bezier(.16,1,.3,1)');
    enter('.p-hero-role', [{ opacity: 0, translate: `0 ${8 * typeUnit}px` }, { opacity: 1, translate: '0 0' }], 580, 430);
    enter('.p-hero-scene-assembly', [{ opacity: 0, translate: `0 ${18 * designUnit}px`, scale: '.985' }, { opacity: 1, translate: '0 0', scale: '1' }], 980, 390, 'cubic-bezier(.16,1,.3,1)');
    hero.querySelectorAll('.p-hero-nav a').forEach((target, index) => {
      animations.push(target.animate([{ opacity: 0, translate: `${-7 * typeUnit}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 470, delay: 690 + index * 52, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
    });
    Promise.allSettled(animations.map((animation) => animation.finished)).then(finishEntrance);
  });
})();
