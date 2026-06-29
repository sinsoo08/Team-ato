/* ══════════════════════════════════
   TEAM 아토 — color-jump.js
   COLOR JUMP 상세 페이지 전용
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

/* ── 히어로 파티클 캔버스 (무지개 계열) ── */
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

  /* COLOR JUMP = 7가지 무지개 파티클 */
  const COLORS = [
    '#e85555', '#e8a035', '#e8d435',
    '#55c85a', '#3a9de8', '#8b5ce8', '#e855c8'
  ];
  const particles = Array.from({ length: 65 }, () => makeParticle());

  function makeParticle(fromBottom = false) {
    return {
      x:        Math.random() * canvas.width,
      y:        fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size:     Math.random() * 7 + 2,
      rot:      Math.random() * Math.PI * 2,
      rotV:     (Math.random() - 0.5) * 0.005,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:       (Math.random() - 0.5) * 0.25,
      vy:       -(Math.random() * 0.3 + 0.08),
      life:     fromBottom ? 0 : Math.random() * 0.6,
      maxAlpha: Math.random() * 0.32 + 0.08,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.rot  += p.rotV;
      p.life += 0.0017;

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