/* ═══════════════════════════════════════════
   TEAM ATO — script.js
═══════════════════════════════════════════ */

/* ─ 별 파티클 ─ */
(function() {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    stars.forEach(s => {
      s.a = 0.3 + 0.5 * Math.sin(frame * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  makeStars(160);
  draw();
  window.addEventListener('resize', () => { resize(); makeStars(160); });
})();

/* ─ 햄버거 메뉴 ─ */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
burger.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

/* ─ 스크롤 reveal ─ */
const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    // 같은 부모 내 형제들에 순차 딜레이
    const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(e.target);
    setTimeout(() => e.target.classList.add('vis'), idx * 70);
    ro.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ─ 숫자 카운트 애니메이션 ─ */
function countUp(el, target, duration = 1800) {
  const isK   = target >= 1000;
  const final = isK ? target / 1000 : target;
  const suffix = isK ? 'K+' : '+';
  const start = performance.now();

  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * final) + (p < 1 ? '' : suffix);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final + suffix;
  })(start);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target.querySelector('.hs-n[data-to]');
    if (el && !el.dataset.done) {
      el.dataset.done = '1';
      countUp(el, parseInt(el.dataset.to));
    }
    countObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats .hs').forEach(el => countObs.observe(el));

/* ─ 맵 필터 ─ */
const filterBtns = document.querySelectorAll('.f-btn');
const mapCards   = document.querySelectorAll('.map-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.f;
    mapCards.forEach(card => {
      if (filter === 'all' || card.dataset.g === filter) {
        card.classList.remove('hidden');
        // 필터 후 재노출 애니메이션
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = '';
          card.style.opacity   = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        });
      } else {
        card.classList.add('hidden');
        card.style.opacity   = '';
        card.style.transform = '';
        card.style.transition = '';
      }
    });
  });
});

/* ─ FAQ 아코디언 ─ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─ 네비바 스크롤 효과 ─ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(5,8,15,0.98)'
    : 'rgba(5,8,15,0.93)';
  nav.style.boxShadow = window.scrollY > 50
    ? '0 2px 30px rgba(0,0,0,0.5)'
    : '0 2px 24px rgba(61,143,36,0.15)';
}, { passive: true });

/* ─ 다운로드 버튼 피드백 ─ */
document.querySelectorAll('.dl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = '✓ 준비중';
    btn.style.background    = '#1a7a3a';
    btn.style.color         = '#fff';
    btn.style.borderColor   = '#2da050';
    setTimeout(() => {
      btn.textContent         = orig;
      btn.style.background    = '';
      btn.style.color         = '';
      btn.style.borderColor   = '';
    }, 2200);
  });
});

/* ─ 핫바 슬롯 클릭 ─ */
document.querySelectorAll('.hb-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.hb-slot').forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
  });
});