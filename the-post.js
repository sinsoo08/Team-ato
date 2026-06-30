/* ══════════════════════════════════
   TEAM 아토 — the-post.js
   THE POST 상세 페이지 전용
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

/* ── 히어로 파티클 캔버스 (시안/청록 계열) ── */
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

  const COLORS = ['#22d3ee', '#67e8f9', '#a5f3fc', '#0891b2', '#ffffff'];
  const particles = Array.from({ length: 55 }, () => makeParticle());

  function makeParticle(fromBottom = false) {
    return {
      x:        Math.random() * canvas.width,
      y:        fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size:     Math.random() * 6 + 2,
      rot:      Math.random() * Math.PI * 2,
      rotV:     (Math.random() - 0.5) * 0.004,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:       (Math.random() - 0.5) * 0.2,
      vy:       -(Math.random() * 0.26 + 0.07),
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