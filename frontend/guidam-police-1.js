/* ══════════════════════════════════
   TEAM 아토 — guidam-police-1.js
   귀담경찰 1 상세 페이지 전용
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

/* ── 히어로 파티클 캔버스 (붉은 계열) ── */
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

  const COLORS = ['#e85555', '#f87171', '#fca5a5', '#b91c1c', '#ffffff'];
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
/* ── 갤러리 뷰어 + 라이트박스 ── */
(function () {
  const thumbs = [...document.querySelectorAll('.gv-thumb')];
  if (!thumbs.length) return;
  const images = thumbs.map(t => t.querySelector('img')?.src).filter(Boolean);
  if (!images.length) return;

  const mainImg  = document.getElementById('gvMainImg');
  const counter  = document.getElementById('gvCounter');
  const mainWrap = document.getElementById('gvMain');
  const prevBtn  = document.getElementById('gvPrev');
  const nextBtn  = document.getElementById('gvNext');

  const lightbox      = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCount  = document.getElementById('lightboxCount');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev  = document.getElementById('lightboxPrev');
  const lbNext  = document.getElementById('lightboxNext');

  let idx = 0;

  function render() {
    mainImg.src = images[idx];
    counter.textContent = `${idx + 1} / ${images.length}`;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
    if (lightbox && lightbox.classList.contains('open')) {
      lightboxImg.src = images[idx];
      lightboxCount.textContent = `${idx + 1} / ${images.length}`;
    }
  }
  function show(i) {
    idx = (i + images.length) % images.length;
    render();
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  prevBtn.addEventListener('click', () => show(idx - 1));
  nextBtn.addEventListener('click', () => show(idx + 1));

  if (lightbox) {
    function openLightbox() {
      lightboxImg.src = images[idx];
      lightboxCount.textContent = `${idx + 1} / ${images.length}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    mainWrap.addEventListener('click', openLightbox);
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => show(idx - 1));
    lbNext.addEventListener('click', () => show(idx + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  render();
})();
