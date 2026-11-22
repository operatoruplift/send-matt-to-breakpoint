/* Binance Week sponsor page: motion layer.
   Progressive: the page is complete without this file. Nothing here runs
   while the tab is hidden, and prefers-reduced-motion keeps everything still. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = () => Boolean(navigator.connection && navigator.connection.saveData);
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- Count-ups ---------- */
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const countUp = el => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || reduce.matches) { el.textContent = fmt(target); return; }
    const dur = 1400;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // ease-out expo
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  /* ---------- Scroll reveals ---------- */
  const revealAll = () => document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('is-in');
    el.querySelectorAll('[data-count]').forEach(countUp);
  });
  if (!hasIO) {
    revealAll();
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-in');
        el.querySelectorAll('[data-count]').forEach(countUp);
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ---------- Header state and section highlight ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (hasIO) {
    const links = new Map();
    document.querySelectorAll('.desktop-nav a[href^="#"]').forEach(a => links.set(a.getAttribute('href').slice(1), a));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = links.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(a => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Mobile action bar: shown once the hero buttons are scrolled past ---------- */
  const bar = document.querySelector('.mobile-cta');
  const heroActions = document.getElementById('hero-actions');
  if (bar && heroActions && hasIO) {
    new IntersectionObserver(([entry]) => {
      bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }).observe(heroActions);
  } else if (bar) {
    bar.classList.add('is-visible');
  }

  /* ---------- Film previews: silent, loaded only when asked for ---------- */
  document.querySelectorAll('[data-film]').forEach(card => {
    const video = card.querySelector('video[data-src]');
    const button = card.querySelector('.film-toggle');
    if (!video || !button) return;
    const name = card.querySelector('h3') ? card.querySelector('h3').textContent : 'film';
    let manual = false;
    const icon = playing => {
      button.innerHTML = playing
        ? '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
        : '<svg aria-hidden="true"><use href="#i-play"/></svg>';
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', (playing ? 'Pause the ' : 'Play the ') + name + ' preview');
    };
    const play = async explicit => {
      if (!explicit && (!finePointer.matches || reduce.matches || saveData())) return;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      try {
        await video.play();
        card.classList.add('is-playing');
        icon(true);
      } catch (e) { /* a quick pointer exit can cancel the load; the link still works */ }
    };
    const stop = () => { video.pause(); card.classList.remove('is-playing'); icon(false); };
    card.addEventListener('pointerenter', () => play(false));
    card.addEventListener('pointerleave', () => { if (!manual) stop(); });
    button.addEventListener('click', () => {
      if (card.classList.contains('is-playing')) { manual = false; stop(); }
      else { manual = true; play(true); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  });

  /* ---------- Hero globe: halftone dots on a screen grid, turning toward Bangkok ---------- */
  const canvas = document.querySelector('.hero-globe');
  const banner = document.querySelector('.hero-banner');
  if (!canvas || !banner || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const MW = 360, MH = 180;
  let land = null;
  const mask = new Image();
  mask.decoding = 'async';
  mask.onload = () => {
    try {
      const off = document.createElement('canvas');
      off.width = MW; off.height = MH;
      const o = off.getContext('2d');
      o.drawImage(mask, 0, 0, MW, MH);
      const px = o.getImageData(0, 0, MW, MH).data;
      land = new Uint8Array(MW * MH);
      for (let i = 0; i < MW * MH; i++) land[i] = px[i * 4] > 127 ? 1 : 0;
    } catch (e) { land = null; }
    resize();
    frame(performance.now());
    canvas.classList.add('is-ready');
  };
  mask.src = '/assets/land-mask.png';

  const BKK_LAT = 13.7563 * Math.PI / 180, BKK_LON = 100.5018 * Math.PI / 180;
  const bkk = [Math.cos(BKK_LAT) * Math.sin(BKK_LON), Math.sin(BKK_LAT), Math.cos(BKK_LAT) * Math.cos(BKK_LON)];
  const TILT = -0.24; // faces Bangkok's latitude
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, cell = 9;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = banner.clientWidth; H = banner.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const narrow = W < 720;
    R = (narrow ? Math.min(W * 0.48, H * 0.5) : Math.min(H * 0.56, W * 0.32)) * dpr;
    cx = canvas.width / 2; cy = canvas.height * 0.53;
    cell = (narrow ? 7 : 9) * dpr;
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const yaw = BKK_LON - 0.55 + t * 0.09;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(TILT), st = Math.sin(TILT);
    // soft disc, like the shade of the globe on the event banner
    ctx.fillStyle = 'rgba(120, 82, 0, 0.07)';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    const landPath = new Path2D(), seaPath = new Path2D();
    const x0 = Math.floor((cx - R) / cell) * cell, y0 = Math.floor((cy - R) / cell) * cell;
    for (let y = y0; y < cy + R; y += cell) {
      for (let x = x0; x < cx + R; x += cell) {
        const px = x + cell / 2, py = y + cell / 2;
        const dx = (px - cx) / R, dy = (py - cy) / R;
        const r2 = dx * dx + dy * dy;
        if (r2 >= 1) continue;
        const z = Math.sqrt(1 - r2);
        // screen normal -> tilt -> yaw
        const ny = -dy, nz = z;
        const ty = ct * ny - st * nz, tz = st * ny + ct * nz;
        const mx = cyw * dx + syw * tz, mz = -syw * dx + cyw * tz;
        const lat = Math.asin(Math.max(-1, Math.min(1, ty)));
        const lon = Math.atan2(mx, mz);
        let isLand = 0;
        if (land) {
          const u = Math.floor(((lon / (2 * Math.PI)) + 0.5) * MW) % MW;
          const v = Math.min(MH - 1, Math.max(0, Math.floor((0.5 - lat / Math.PI) * MH)));
          isLand = land[v * MW + ((u + MW) % MW)];
        }
        const lam = Math.max(0, Math.min(1, (-0.45 * dx + 0.5 * -dy + 0.74 * z) * 0.8 + 0.25));
        const limb = Math.min(1, z / 0.28);
        const v = (isLand ? 0.9 : 0.09) * (0.3 + 0.7 * lam) * limb;
        const rad = cell * 0.5 * Math.sqrt(v) * 1.05;
        if (rad < 0.45 * dpr) continue;
        const p = isLand ? landPath : seaPath;
        p.moveTo(px + rad, py);
        p.arc(px, py, rad, 0, Math.PI * 2);
      }
    }
    const narrow = W < 720;
    ctx.fillStyle = narrow ? 'rgba(96, 62, 0, 0.24)' : 'rgba(96, 62, 0, 0.3)';
    ctx.fill(landPath);
    ctx.fillStyle = narrow ? 'rgba(96, 62, 0, 0.11)' : 'rgba(96, 62, 0, 0.15)';
    ctx.fill(seaPath);
    // Bangkok pin when it faces us
    const bx = cyw * bkk[0] - syw * bkk[2], bzY = syw * bkk[0] + cyw * bkk[2];
    const sy = ct * bkk[1] + st * bzY, sz = -st * bkk[1] + ct * bzY;
    if (sz > 0.12) {
      const pxp = cx + R * bx, pyp = cy - R * sy;
      const a = Math.min(1, (sz - 0.12) / 0.25);
      const phase = (t % 1.8) / 1.8;
      ctx.strokeStyle = `rgba(11, 14, 17, ${0.55 * (1 - phase) * a})`;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath(); ctx.arc(pxp, pyp, (6 + phase * 26) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(11, 14, 17, ${0.9 * a})`;
      ctx.beginPath(); ctx.arc(pxp, pyp, 5 * dpr, 0, Math.PI * 2); ctx.fill();
    }
  }

  let running = false, visible = true, last = 0, start = performance.now();
  function frame(now) {
    if (now - last >= 1000 / 30 || !running) {
      last = now;
      draw(reduce.matches ? 0 : (now - start) / 1000);
    }
    if (running) requestAnimationFrame(frame);
  }
  function update() {
    const should = visible && !document.hidden && !reduce.matches;
    if (should && !running) { running = true; requestAnimationFrame(frame); }
    else if (!should) running = false;
  }
  if (hasIO) new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }).observe(banner);
  document.addEventListener('visibilitychange', update);
  if (reduce.addEventListener) reduce.addEventListener('change', () => { update(); frame(performance.now()); });
  let rz = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => { resize(); if (!running) frame(performance.now()); });
  });
  update();
})();
