/* ══════════════════════════════════
   TEAM 아토 OFFICIAL — script.js
══════════════════════════════════ */

/* ─ 네비 스크롤 ─ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ─ 햄버거 ─ */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ─ 스크롤 reveal ─ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.vis)')];
    siblings.forEach((el, i) => setTimeout(() => el.classList.add('vis'), i * 60));
    ro.unobserve(e.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ─ 숫자 카운트 ─ */
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target.querySelector('.sb-n[data-to]');
    if (!el || el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.to);
    const start  = performance.now();
    (function tick(now) {
      const p    = Math.min((now - start) / 1600, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + (p < 1 ? '' : '+');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    co.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.sb-item').forEach(el => co.observe(el));

/* ─ FAQ 아코디언 ─ */
document.querySelectorAll('.fq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.fq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.fq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─ 핫바 슬롯 ─ */
document.querySelectorAll('.hb-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.hb-slot').forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
    const item = slot.querySelector('span')?.textContent || '';
    const tooltip = document.querySelector('.mc-tooltip');
    const labels = { '⛏':'나무 곡괭이','🪵':'나무 원목','🍎':'사과','⚔️':'철 검','💎':'다이아몬드','🛡️':'철 방패','🗺️':'빈 지도','🔥':'부싯돌과 부시','📜':'인챈트 책' };
    if (tooltip) tooltip.textContent = labels[item] || '아이템';
  });
});

/* ─ 다운로드 버튼 피드백 ─ */
function dlFeedback(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓ 완료!';
  btn.style.background = 'var(--c, var(--blue-600))';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
  }, 2000);
}