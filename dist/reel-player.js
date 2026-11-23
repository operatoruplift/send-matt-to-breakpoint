/* Brand-themed player for the reel on the Binance Week page.
   Progressive: without this file the <video> keeps its native controls.
   Nothing downloads until someone presses play (preload="none"). */
(() => {
  'use strict';
  const fig = document.querySelector('[data-reel]');
  if (!fig) return;
  const $ = sel => fig.querySelector(sel);
  const frame = $('.reel-frame');
  const video = $('.reel-video');
  const ui = $('.reel-ui');
  const big = $('.reel-big');
  const end = $('.reel-end');
  const replay = $('.reel-replay');
  const track = $('.reel-track');
  const rail = $('.reel-rail');
  const progress = $('.reel-progress');
  const buffer = $('.reel-buffer');
  const thumb = $('.reel-thumb');
  const tip = $('.reel-tip');
  const tipTime = $('.reel-tip-time');
  const tipCh = $('.reel-tip-ch');
  const cur = $('.reel-cur');
  const dur = $('.reel-dur');
  const chapterEl = $('.reel-chapter');
  const playBtn = $('.reel-play');
  const muteBtn = $('.reel-mute');
  const vol = $('.reel-vol');
  const fsBtn = $('.reel-fs');
  if (!frame || !video || !ui) return;

  // Chapters follow the bar lines the reel is cut on.
  const CHAPTERS = [
    [0, 'Cold open'], [4.0, 'The drop'], [11.78, 'From the floor'], [15.67, 'Who is filming'],
    [19.56, 'By the numbers'], [27.34, 'Event films'], [33.18, 'Packages'], [40.96, 'Four steps'], [46.79, 'Book a spot'],
  ];
  let D = 54.016;

  fig.classList.add('is-custom');
  video.removeAttribute('controls');
  ui.hidden = false;

  // Sharp screens get the 1080p file, everyone else (and Save-Data) the 720p one.
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const px = Math.min(window.screen && screen.width ? screen.width : innerWidth, innerWidth * 2) * (window.devicePixelRatio || 1);
  const wanted = !saveData && px >= 1500 ? video.dataset.srcHd : video.dataset.srcSd;
  if (wanted && video.getAttribute('src') !== wanted) video.setAttribute('src', wanted);

  const fmt = s => {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  const chapterAt = t => {
    let name = CHAPTERS[0][1];
    for (const [start, label] of CHAPTERS) if (t >= start - 0.02) name = label;
    return name;
  };
  const icon = (btn, id) => { const use = btn.querySelector('use'); if (use) use.setAttribute('href', '#' + id); };

  CHAPTERS.slice(1).forEach(([t]) => {
    const tick = document.createElement('span');
    tick.className = 'reel-tick';
    tick.style.left = (t / D) * 100 + '%';
    rail.appendChild(tick);
  });

  function render() {
    const t = video.currentTime || 0;
    const d = video.duration || D;
    const p = Math.min(1, t / d);
    progress.style.transform = 'scaleX(' + p + ')';
    thumb.style.left = p * 100 + '%';
    cur.textContent = fmt(t);
    track.setAttribute('aria-valuenow', t.toFixed(1));
    track.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(d) + ', ' + chapterAt(t));
    const ch = chapterAt(t);
    if (chapterEl.textContent !== ch) chapterEl.textContent = ch;
    try {
      if (video.buffered.length) buffer.style.transform = 'scaleX(' + Math.min(1, video.buffered.end(video.buffered.length - 1) / d) + ')';
    } catch (e) { /* buffered can throw while the source changes */ }
  }

  let raf = 0;
  const loop = () => { render(); if (!video.paused) raf = requestAnimationFrame(loop); };

  // Controls fade out while the reel plays and nobody is touching it.
  let idleTimer = 0;
  const poke = () => {
    fig.classList.remove('is-idle');
    clearTimeout(idleTimer);
    if (!video.paused) idleTimer = setTimeout(() => fig.classList.add('is-idle'), 2400);
  };

  const play = () => {
    end.hidden = true;
    fig.classList.remove('is-ended');
    if (video.ended) video.currentTime = 0;
    const p = video.play();
    if (p && p.catch) p.catch(() => { fig.classList.remove('is-waiting'); });
  };
  const toggle = () => (video.paused || video.ended ? play() : video.pause());

  big.addEventListener('click', play);
  playBtn.addEventListener('click', toggle);
  replay.addEventListener('click', () => { video.currentTime = 0; play(); });

  // On touch, the first tap on a playing reel shows the controls instead of pausing it.
  let lastPointer = 'mouse';
  let wasIdle = false;
  video.addEventListener('pointerdown', e => { lastPointer = e.pointerType; wasIdle = fig.classList.contains('is-idle'); });
  video.addEventListener('click', () => {
    if (lastPointer === 'touch' && !video.paused && wasIdle) { poke(); return; }
    toggle();
  });

  video.addEventListener('play', () => {
    fig.classList.add('is-playing', 'has-started');
    icon(playBtn, 'i-pause');
    playBtn.setAttribute('aria-label', 'Pause');
    cancelAnimationFrame(raf);
    loop();
    poke();
  });
  video.addEventListener('pause', () => {
    fig.classList.remove('is-playing', 'is-idle', 'is-waiting');
    icon(playBtn, 'i-play');
    playBtn.setAttribute('aria-label', 'Play');
    clearTimeout(idleTimer);
    render();
  });
  video.addEventListener('ended', () => {
    fig.classList.add('is-ended');
    fig.classList.remove('is-idle');
    end.hidden = false;
    const first = end.querySelector('a, button');
    if (first && fig.contains(document.activeElement)) first.focus({ preventScroll: true });
  });
  video.addEventListener('waiting', () => fig.classList.add('is-waiting'));
  ['playing', 'canplay', 'seeked'].forEach(ev => video.addEventListener(ev, () => fig.classList.remove('is-waiting')));
  video.addEventListener('loadedmetadata', () => { D = video.duration || D; dur.textContent = fmt(D); render(); });
  video.addEventListener('progress', render);
  video.addEventListener('timeupdate', () => { if (video.paused) render(); });
  video.addEventListener('error', () => { fig.classList.remove('is-waiting'); });

  // Seeking: drag or click on the rail, arrows on the keyboard.
  const timeAt = e => {
    const r = track.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    return { t: x * (video.duration || D), x };
  };
  let dragging = false;
  track.addEventListener('pointerdown', e => {
    dragging = true;
    if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
    fig.classList.add('is-scrubbing');
    video.currentTime = timeAt(e).t;
    render();
    poke();
  });
  track.addEventListener('pointermove', e => {
    const { t, x } = timeAt(e);
    tip.style.left = x * 100 + '%';
    tipTime.textContent = fmt(t);
    tipCh.textContent = chapterAt(t);
    if (dragging) { video.currentTime = t; render(); }
  });
  const stopDrag = () => { dragging = false; fig.classList.remove('is-scrubbing'); };
  track.addEventListener('pointerup', stopDrag);
  track.addEventListener('pointercancel', stopDrag);
  track.addEventListener('keydown', e => {
    const d = video.duration || D;
    let t = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') t = Math.min(d, video.currentTime + 5);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') t = Math.max(0, video.currentTime - 5);
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = d - 0.1;
    if (t !== null) { e.preventDefault(); e.stopPropagation(); video.currentTime = t; render(); poke(); }
  });

  // Sound
  const syncVol = () => {
    const off = video.muted || video.volume === 0;
    icon(muteBtn, off ? 'i-mute' : 'i-vol');
    muteBtn.setAttribute('aria-label', off ? 'Unmute' : 'Mute');
    vol.value = off ? 0 : video.volume;
    vol.style.setProperty('--v', vol.value);
  };
  muteBtn.addEventListener('click', () => {
    if (video.muted || video.volume === 0) { video.muted = false; if (video.volume === 0) video.volume = 0.8; }
    else video.muted = true;
  });
  vol.addEventListener('input', () => { video.volume = Number(vol.value); video.muted = video.volume === 0; });
  video.addEventListener('volumechange', syncVol);

  // Full screen keeps the branded controls where the browser allows it (iPhone uses its own player).
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  fsBtn.addEventListener('click', () => {
    if (fsElement()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else if (frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => {});
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  });
  const syncFs = () => {
    const on = fsElement() === frame;
    fig.classList.toggle('is-fullscreen', on);
    icon(fsBtn, on ? 'i-exitfull' : 'i-full');
    fsBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
  };
  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('webkitfullscreenchange', syncFs);

  // Keyboard, once the player has focus: space or K, arrows, M, F.
  frame.addEventListener('keydown', e => {
    if (e.target === vol || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();
    const onButton = e.target.closest && e.target.closest('button, a');
    if ((k === ' ' && !onButton) || k === 'k') { e.preventDefault(); toggle(); poke(); }
    else if (k === 'm') { muteBtn.click(); poke(); }
    else if (k === 'f') { fsBtn.click(); }
    else if ((k === 'arrowright' || k === 'arrowleft') && e.target !== track) {
      e.preventDefault();
      video.currentTime = Math.max(0, Math.min(video.duration || D, video.currentTime + (k === 'arrowright' ? 5 : -5)));
      render(); poke();
    }
  });
  ['pointermove', 'pointerdown', 'focusin'].forEach(ev => frame.addEventListener(ev, poke));

  // Leaving the tab pauses the reel, so the music does not keep playing unseen.
  document.addEventListener('visibilitychange', () => { if (document.hidden && !video.paused) video.pause(); });

  dur.textContent = fmt(D);
  render();
  syncVol();
})();
