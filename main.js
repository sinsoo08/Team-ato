/* ══════════════════════════════════════
   TEAM ATO — script.js
══════════════════════════════════════ */

/* ── 햄버거 메뉴 ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 메뉴 링크 클릭 시 닫기
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── 스크롤 reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // 형제 요소들이 순서대로 나타나도록 딜레이
      const siblings = e.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === e.target) delay = idx * 80;
      });
      setTimeout(() => e.target.classList.add('visible'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 숫자 카운트 애니메이션 ── */
function animateCount(el, target, duration = 1600) {
  const suffix = target >= 1000 ? 'K+' : (el.dataset.count < 100 ? '+' : '');
  const displayTarget = target >= 1000 ? target / 1000 : target;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * displayTarget);
    el.textContent = current + (progress < 1 ? '' : suffix);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = displayTarget + suffix;
  }

  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target.querySelector('.stat-value[data-count]');
      if (el && !el.dataset.animated) {
        el.dataset.animated = true;
        animateCount(el, parseInt(el.dataset.count));
      }
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-band .stat-item').forEach(el => {
  countObserver.observe(el);
});

/* ── FAQ 아코디언 ── */
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item    = q.closest('.faq-item');
    const isOpen  = item.classList.contains('open');

    // 전부 닫기
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // 클릭한 것만 열기 (이미 열려 있으면 닫힌 상태 유지)
    if (!isOpen) item.classList.add('open');
  });
});

/* ── 네비 스크롤 효과 ── */
const navEl = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navEl.style.background = 'rgba(6,8,15,0.97)';
    navEl.style.boxShadow  = '0 2px 24px rgba(0,0,0,0.4)';
  } else {
    navEl.style.background = 'rgba(6,8,15,0.88)';
    navEl.style.boxShadow  = 'none';
  }
}, { passive: true });

/* ── 다운로드 버튼 (임시 알림) ── */
document.querySelectorAll('.btn-dl').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.closest('.map-card-body').querySelector('.map-card-title').textContent;
    btn.textContent = '✓ 준비중';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = '다운로드';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });
});