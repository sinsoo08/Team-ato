/* ══════════════════════════════════
   TEAM 아토 — lain.js
   LAIN 상세 페이지 전용
══════════════════════════════════ */

/* ── 네비 스크롤 ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── 햄버거 ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── 히어로 파티클 캔버스 (흑백 + 보라 계열) ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* LAIN = 흑백 위주 + 보라 포인트 */
  const COLORS = [
    '#ffffff', '#d4d4d8', '#a1a1aa',
    '#8b6fce', '#a78bfa', '#6d28d9',
    '#e0e0e0'
  ];
  const particles = Array.from({ length: 55 }, () => makeParticle());

  function makeParticle(fromBottom = false) {
    return {
      x:        Math.random() * canvas.width,
      y:        fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size:     Math.random() * 5 + 1.5,
      rot:      Math.random() * Math.PI * 2,
      rotV:     (Math.random() - 0.5) * 0.003,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:       (Math.random() - 0.5) * 0.18,
      vy:       -(Math.random() * 0.25 + 0.06),
      life:     fromBottom ? 0 : Math.random() * 0.6,
      maxAlpha: Math.random() * 0.25 + 0.06,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.rot  += p.rotV;
      p.life += 0.0015;

      let alpha;
      if      (p.life < 0.15) alpha = (p.life / 0.15) * p.maxAlpha;
      else if (p.life < 0.75) alpha = p.maxAlpha;
      else                    alpha = ((1 - p.life) / 0.25) * p.maxAlpha;

      const h = p.size / 2;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-h, -h, p.size, p.size);
      ctx.restore();

      if (p.life >= 1 || p.y < -12) particles[i] = makeParticle(true);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
/* ── 스크린샷 갤러리 라이트박스 ── */
(function () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const items = [...grid.querySelectorAll('.gallery-item')];
  const imgs  = items.map(el => el.querySelector('img')?.src).filter(Boolean);
  if (!imgs.length) return;

  const lightbox     = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCount = document.getElementById('lightboxCount');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev  = document.getElementById('lightboxPrev');
  const btnNext  = document.getElementById('lightboxNext');

  let idx = 0;

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    lightboxImg.src = imgs[idx];
    lightboxCount.textContent = `${idx + 1} / ${imgs.length}`;
  }
  function open(i) {
    show(i);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
