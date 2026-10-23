/* Short, silent project recordings load only when someone chooses to preview. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const previews = [];

  document.querySelectorAll('[data-build-preview]').forEach(card => {
    const video = card.querySelector('video[data-preview-src]');
    const button = card.querySelector('.p-build-preview-toggle');
    if (!video || !button) return;
    const name = card.dataset.project || 'project';
    let manual = false;
    let wanted = false;
    let failed = false;
    let autoPaused = false;
    let request = 0;

    const stop = () => {
      wanted = false;
      manual = false;
      request += 1;
      video.pause();
      card.classList.remove('is-preview-playing');
      button.setAttribute('aria-pressed', 'false');
      if (!failed) {
        button.textContent = 'Play preview';
        button.setAttribute('aria-label', `Play ${name} preview`);
      }
    };
    const unavailable = () => {
      failed = true;
      stop();
      button.textContent = 'Preview unavailable';
      button.setAttribute('aria-label', `${name} preview unavailable; project link still available`);
      button.disabled = true;
    };
    const play = async (explicit = false) => {
      if (failed || document.hidden) return;
      if (!explicit && (autoPaused || !finePointer.matches || reduceMotion.matches || navigator.connection?.saveData)) return;
      manual = explicit || manual;
      wanted = true;
      const attempt = ++request;
      if (!video.hasAttribute('src')) video.src = video.dataset.previewSrc;
      try {
        await video.play();
        if (attempt !== request || !wanted) {
          if (!wanted) video.pause();
          return;
        }
        card.classList.add('is-preview-playing');
        button.textContent = 'Pause preview';
        button.setAttribute('aria-label', `Pause ${name} preview`);
        button.setAttribute('aria-pressed', 'true');
      } catch (error) {
        // A leave/scroll may cancel play while the clip is still loading.
        if (attempt === request && wanted && error.name !== 'AbortError') {
          if (error.name === 'NotAllowedError') stop();
          else unavailable();
        }
      }
    };
    card.addEventListener('pointerenter', () => play());
    card.addEventListener('pointerleave', () => {
      if (!card.contains(document.activeElement)) autoPaused = false;
      if (!manual) stop();
    });
    card.addEventListener('focusin', event => { if (event.target !== button) play(); });
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) {
        if (!card.matches(':hover')) autoPaused = false;
        if (!manual) stop();
      }
    });
    button.addEventListener('click', () => {
      if (wanted) { autoPaused = true; stop(); }
      else { autoPaused = false; play(true); }
    });
    video.addEventListener('error', unavailable);
    button.hidden = false;
    previews.push({ card, stop });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) previews.find(preview => preview.card === entry.target)?.stop();
      });
    });
    previews.forEach(preview => observer.observe(preview.card));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) previews.forEach(preview => preview.stop());
  });
  reduceMotion.addEventListener('change', () => previews.forEach(preview => preview.stop()));
})();
