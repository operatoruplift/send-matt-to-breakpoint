(() => {
  const journey = document.querySelector('.journey');
  if (!journey) return;

  const stops = [...journey.children];
  const motion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  let observer;
  let finishTimer;
  let played = false;

  const finish = () => {
    played = true;
    observer?.disconnect();
    window.clearTimeout(finishTimer);
    journey.classList.remove('is-journey-playing');
    journey.classList.add('is-journey-complete');
  };

  if (motion?.matches || !('IntersectionObserver' in window)) {
    finish();
    return;
  }

  stops.forEach((stop, index) => {
    stop.style.setProperty('--journey-delay', `${index * 400}ms`);
  });

  observer = new IntersectionObserver(entries => {
    if (played || !entries.some(entry => entry.intersectionRatio >= 0.4)) return;
    played = true;
    observer.disconnect();
    journey.classList.add('is-journey-playing');
    finishTimer = window.setTimeout(finish, (stops.length - 1) * 400 + 1200);
  }, { threshold: 0.4 });
  observer.observe(journey);

  const reduceMotion = event => { if (event.matches) finish(); };
  if (typeof motion?.addEventListener === 'function') {
    motion.addEventListener('change', reduceMotion);
  } else if (typeof motion?.addListener === 'function') {
    motion.addListener(reduceMotion);
  }
})();
