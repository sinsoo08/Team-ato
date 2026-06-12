/* ══════════════════════════════════
   TEAM 아토 — map.js
   맵 목록 페이지 전용
══════════════════════════════════ */

/* ════════ 헤더 파티클 캔버스 ════════ */
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

  // 파티클 생성
  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#ffffff'];
  const particles = Array.from({ length: 60 }, () => makeParticle());

  function makeParticle(fromBottom = false) {
    return {
      x: Math.random() * canvas.width,
      y: fromBottom ? canvas.height + 10 : Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random(),
    };
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.003;

      // 페이드 인/아웃
      const fade = Math.sin(p.life * Math.PI);
      ctx.save();
      ctx.globalAlpha = fade * p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 수명 끝나면 재생성
      if (p.life >= 1 || p.y < -10) {
        particles[i] = makeParticle(true);
      }
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();


/* ════════ 통계 카운트업 ════════ */
(function () {
  const statNums = document.querySelectorAll('.stat-num[data-to]');

  function countUp(el) {
    const target = parseInt(el.dataset.to);
    const isDl   = el.id === 'stat-dl';
    const isPct  = el.classList.contains('stat-pct');
    const dur    = isDl ? 2000 : 1200;
    const start  = performance.now();

    (function tick(now) {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = Math.floor(ease * target);

      if (isDl) {
        el.textContent = val.toLocaleString('ko-KR') + (p >= 1 ? '+' : '');
      } else if (isPct) {
        el.textContent = val;   // % 는 CSS ::after 로
      } else {
        el.textContent = val + (p >= 1 && el.dataset.suffix ? el.dataset.suffix : '');
      }

      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => obs.observe(el));
})();


/* ════════ 카드 스크롤 reveal ════════ */
(function () {
  const cards = document.querySelectorAll('.mc');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      // 같은 행의 카드들을 함께 stagger
      const siblings = [...document.querySelectorAll('.mc:not(.visible):not(.hidden)')];
      const visible  = siblings.filter(s => {
        const r = s.getBoundingClientRect();
        return r.top < window.innerHeight + 20;
      });

      visible.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
          // 다운로드 바 애니메이션 — 카드 보인 뒤 딜레이
          setTimeout(() => {
            const bar = el.querySelector('.mc-dl-bar');
            if (bar) bar.style.width = bar.style.getPropertyValue('--pct') || getComputedStyle(bar).getPropertyValue('--pct');
          }, 200);
        }, i * 70);
      });

      obs.disconnect();
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  if (cards.length) obs.observe(cards[0]);
})();


/* ════════ 다운로드 바 (CSS variable → width) ════════ */
// CSS에서 --pct 를 직접 width 에 넣어 뒀으므로
// 카드가 visible 되는 시점에 transition 이 자연스럽게 재생됨
// (초기값 width:0 → visible 후 style.width = '--pct' 값)

function applyBar(card) {
  const bar = card.querySelector('.mc-dl-bar');
  if (!bar) return;
  const pct = bar.style.cssText.match(/--pct:\s*([^;]+)/)?.[1]?.trim() || '0%';
  requestAnimationFrame(() => { bar.style.width = pct; });
}

// 초기 화면에 이미 보이는 카드
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mc').forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      card.classList.add('visible');
      setTimeout(() => applyBar(card), 300);
    }
  });
});


/* ════════ 필터 ════════ */
(function () {
  const filterBtns = document.querySelectorAll('.flt');
  const grid       = document.getElementById('mapGrid');
  const emptyMsg   = document.getElementById('mapEmpty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const cards  = grid.querySelectorAll('.mc');
      let visible  = 0;

      cards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.tag === filter;
        if (match) {
          card.classList.remove('hidden');
          // stagger 재진입 애니메이션
          card.style.opacity = '0';
          card.style.transform = 'translateY(14px)';
          setTimeout(() => {
            card.style.opacity = '';
            card.style.transform = '';
            card.classList.add('visible');
            applyBar(card);
          }, visible * 55);
          visible++;
        } else {
          card.classList.add('hidden');
          card.classList.remove('visible');
        }
      });

      emptyMsg.classList.toggle('show', visible === 0);
    });
  });
})();


/* ════════ 정렬 ════════ */
(function () {
  const select = document.getElementById('sortSelect');
  const grid   = document.getElementById('mapGrid');

  select.addEventListener('change', () => {
    const val   = select.value;
    const cards = [...grid.querySelectorAll('.mc')];

    cards.sort((a, b) => {
      if (val === 'dl-desc') return parseInt(b.dataset.dl) - parseInt(a.dataset.dl);
      if (val === 'dl-asc')  return parseInt(a.dataset.dl) - parseInt(b.dataset.dl);
      if (val === 'new')     return parseInt(b.dataset.year) - parseInt(a.dataset.year);
      // default: DOM 원래 순서 (data-order 기준)
      return parseInt(a.dataset.order || 0) - parseInt(b.dataset.order || 0);
    });

    // 재배치 + 애니메이션
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      grid.appendChild(card);
      setTimeout(() => {
        card.style.opacity = '';
        card.style.transform = '';
      }, i * 40);
    });
  });

  // 초기 순서 저장
  grid.querySelectorAll('.mc').forEach((card, i) => {
    card.dataset.order = i;
  });
})();


/* ════════ 다운로드 버튼 피드백 ════════ */
function dlFeedback(btn) {
  if (btn.disabled) return;
  const orig = btn.textContent;
  btn.textContent = '✓ 완료!';
  btn.style.background = '#059669';
  btn.style.color = '#fff';
  btn.style.borderColor = '#059669';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2000);
}