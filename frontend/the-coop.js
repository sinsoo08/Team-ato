/* ══════════════════════════════════
   TEAM 아토 — the-coop.js
   THE CO-OP 상세 페이지 전용
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

/* ── 히어로 파티클 캔버스 (녹색 계열) ── */
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

  const COLORS = ['#5ac86e', '#86efac', '#bbf7d0', '#16a34a', '#ffffff'];
  const particles = Array.from({ length: 50 }, () => makeParticle());

  function makeParticle(fromBottom = false) {
    return {
      x:        Math.random() * canvas.width,
      y:        fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size:     Math.random() * 6 + 2,
      rot:      Math.random() * Math.PI * 2,
      rotV:     (Math.random() - 0.5) * 0.004,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:       (Math.random() - 0.5) * 0.22,
      vy:       -(Math.random() * 0.28 + 0.07),
      life:     fromBottom ? 0 : Math.random() * 0.6,
      maxAlpha: Math.random() * 0.3 + 0.07,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.rot  += p.rotV;
      p.life += 0.0016;

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
