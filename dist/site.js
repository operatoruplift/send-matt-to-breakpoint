(() => {
  const dialog = document.querySelector('#demo-dialog');
  const player = dialog?.querySelector('.demo-player');
  if (!dialog || !player || typeof dialog.showModal !== 'function') return;

  document.querySelectorAll('[data-open-demo]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      dialog.showModal();
      if (!player.hasAttribute('src')) player.src = player.dataset.src;
      player.play().catch(() => {
        // Native controls remain available when playback needs another tap.
      });
    });
  });
  dialog.querySelector('.close-demo')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => player.pause());
})();
