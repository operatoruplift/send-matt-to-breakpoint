// Motion supplements an otherwise fully readable, linked static portfolio.
(() => {
  const body = document.querySelector('.p-body');
  if (!body) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const marquee = body.querySelector('.p-marquee');
  const tracks = [...body.querySelectorAll('.p-marquee-row')].map(row => {
    const track = row.querySelector('.p-marquee-track');
    const originals = [...track.children];
    originals.forEach(tile => {
      const duplicate = tile.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      track.append(duplicate);
    });
    return { row, track, direction:Number(row.dataset.marqueeDirection) || 1, originals };
  });
  const aboutCopy = body.querySelector('[data-p-reveal-text]');
  let chars = [];
  if (aboutCopy && !media.matches) {
    const text = aboutCopy.textContent;
    aboutCopy.textContent = '';
    const fragment = document.createDocumentFragment();
    const accessibleText = document.createElement('span');
    accessibleText.className = 'p-sr-only';
    accessibleText.textContent = text;
    fragment.append(accessibleText);
    for (const char of text) {
      const span = document.createElement('span');
      span.className = 'p-reveal-char';
      span.textContent = char;
      span.setAttribute('aria-hidden', 'true');
      fragment.append(span);
      chars.push(span);
    }
    aboutCopy.append(fragment);
  }
  const cards = [...body.querySelectorAll('.p-project-card')];
  const watched = [marquee, aboutCopy, ...cards].filter(Boolean);
  const visible = new Set();
  let scheduled = false;
  let observationReady = false;
  const clamp = value => Math.max(0, Math.min(1, value));

  function draw() {
    scheduled = false;
    const height = window.innerHeight;
    if (media.matches) {
      tracks.forEach(({track}) => { track.style.transform = ''; });
      chars.forEach(char => { char.style.opacity = '1'; });
      cards.forEach(card => { card.style.transform = ''; });
      return;
    }
    if (marquee && (!observationReady || visible.has(marquee))) {
      const bounds = marquee.getBoundingClientRect();
      const offset = (height - bounds.top) * .2;
      tracks.forEach(({track,direction,originals}) => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const width = originals.reduce((sum,tile) => sum + tile.getBoundingClientRect().width + gap,0);
        if (width <= 0) return;
        const distance = ((offset % width) + width) % width;
        const translate = direction > 0 ? distance - width : -distance;
        track.style.transform = `translate3d(${translate.toFixed(2)}px,0,0)`;
      });
    }
    if (aboutCopy && chars.length && (!observationReady || visible.has(aboutCopy))) {
      const bounds = aboutCopy.getBoundingClientRect();
      const progress = clamp((height*.85 - bounds.top)/(height*.65 + bounds.height));
      chars.forEach((char,index) => {
        const revealed = clamp((progress-index/chars.length)*5);
        char.style.opacity = String(.68 + .32*revealed);
      });
    }
    if (window.innerWidth >= 768) {
      cards.forEach((card,index) => {
        if (index === cards.length-1) return;
        const next = cards[index+1].getBoundingClientRect();
        const progress = clamp((height-next.top)/height);
        const target = 1-(cards.length-1-index)*.025;
        card.style.transform = `scale(${(1-(1-target)*progress).toFixed(4)})`;
      });
    } else {
      cards.forEach(card => { card.style.transform = ''; });
    }
  }
  function schedule() {
    if (scheduled) return;
    if (observationReady && !visible.size && !media.matches) return;
    scheduled = true;
    window.requestAnimationFrame(draw);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      observationReady = true;
      schedule();
    }, {rootMargin:'150px 0px'});
    watched.forEach(element => observer.observe(element));
  }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  media.addEventListener('change', schedule);
  schedule();
})();
