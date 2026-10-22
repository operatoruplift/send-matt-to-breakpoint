// A one-time entrance enhancement; the static portfolio is complete without it.
(() => {
  const body = document.querySelector('.p-body');
  if (!body || !('IntersectionObserver' in window)) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;
  const sections = [...body.querySelectorAll('[data-p-reveal]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('p-is-visible');
      observer.unobserve(entry.target);
    });
  }, {rootMargin:'0px 0px 50px 0px', threshold:0.08});
  sections.forEach(section => {
    section.classList.add('p-reveal-ready');
    observer.observe(section);
  });
  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    sections.forEach(section => section.classList.add('p-is-visible'));
    observer.disconnect();
  });
})();
