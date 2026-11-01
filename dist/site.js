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

(() => {
  const root = document.querySelector('[data-raised]');
  if (!root) return;
  const goal = 2000;
  const raised = Number(root.dataset.raised);
  const amount = Number.isFinite(raised) ? Math.max(0, raised) : 0;
  const pct = Math.min(100, (amount / goal) * 100);
  const label = root.querySelector('[data-raised-text]');
  const bar = root.querySelector('[role="progressbar"]');
  const fill = root.querySelector('.funding-progress-fill');
  const raisedText = `$${amount.toLocaleString('en-US')} raised`;
  const valueText = `${raisedText} of $2,000`;
  if (label) label.textContent = raisedText;
  if (bar) {
    bar.setAttribute('aria-valuenow', String(amount));
    bar.setAttribute('aria-valuemax', String(goal));
    bar.setAttribute('aria-valuetext', valueText);
  }
  if (fill) fill.style.width = `${pct}%`;
})();
