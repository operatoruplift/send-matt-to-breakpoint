(() => {
  const journey = document.querySelector('.journey');
  if (!journey) return;

  const stops = [...journey.children];
  const motion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const phases = ['is-journey-playing', 'is-journey-complete', 'is-journey-resetting'];
  const setPhase = phase => {
    journey.classList.remove(...phases);
    if (phase) journey.classList.add(phase);
  };
  if (!('IntersectionObserver' in window)) {
    setPhase('is-journey-complete');
    return;
  }

  const stopInterval = 850;
  const flightDuration = 1800;
  let visible = false;
  let timer;
  const canAnimate = () => visible && !document.hidden && !motion?.matches;

  stops.forEach((stop, index) => {
    stop.style.setProperty('--journey-delay', `${index * stopInterval}ms`);
  });

  const play = () => {
    if (!canAnimate()) return;
    setPhase('is-journey-playing');
    timer = window.setTimeout(() => {
      if (!canAnimate()) return;
      setPhase('is-journey-complete');
      timer = window.setTimeout(() => {
        if (!canAnimate()) return;
        setPhase('is-journey-resetting');
        timer = window.setTimeout(play, 650);
      }, 3000);
    }, (stops.length - 1) * stopInterval + flightDuration);
  };

  const sync = () => {
    window.clearTimeout(timer);
    setPhase(motion?.matches ? 'is-journey-complete' : null);
    if (canAnimate()) play();
  };
  const observer = new IntersectionObserver(entries => {
    const entry = entries[entries.length - 1];
    const nextVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
    if (nextVisible === visible) return;
    visible = nextVisible;
    sync();
  }, { threshold: 0.4 });
  observer.observe(journey);

  document.addEventListener('visibilitychange', sync);
  if (typeof motion?.addEventListener === 'function') {
    motion.addEventListener('change', sync);
  } else if (typeof motion?.addListener === 'function') {
    motion.addListener(sync);
  }
  sync();
})();
