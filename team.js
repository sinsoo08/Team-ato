/* ══════════════════════════════════
   TEAM 아토 — team.js
══════════════════════════════════ */

/* ════════ 히어로 파티클 캔버스 ════════ */
(function () {
  const canvas = document.getElementById('tmCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 팀 색상 — 블루/퍼플 계열
  const COLORS = ['#3b82f6','#60a5fa','#818cf8','#a78bfa','#c4b5fd','#dbeafe'];
  const dots   = Array.from({ length: 55 }, () => mkDot());

  function mkDot(fromBottom = false) {
    const size = Math.random() * 7 + 3;
    return {
      x:     Math.random() * canvas.width,
      y:     fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size,
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.004,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -(Math.random() * 0.3 + 0.08),
      life:  fromBottom ? 0 : Math.random() * 0.6,
      maxAlpha: Math.random() * 0.35 + 0.08,
    };
  }

  (function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((d, i) => {
      d.x    += d.vx;
      d.y    += d.vy;
      d.rot  += d.rotV;
      d.life += 0.0018;

      let alpha;
      if (d.life < 0.15)       alpha = (d.life / 0.15) * d.maxAlpha;
      else if (d.life < 0.75)  alpha = d.maxAlpha;
      else                     alpha = ((1 - d.life) / 0.25) * d.maxAlpha;

      const h = d.size / 2;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle   = d.color;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-h, -h, d.size, d.size);
      ctx.restore();

      if (d.life >= 1 || d.y < -12) dots[i] = mkDot(true);
    });
    requestAnimationFrame(frame);
  })();
})();


/* ════════ 필터 탭 ════════ */
(function () {
  const filterBtns = document.querySelectorAll('.tm-flt');
  const sections   = document.querySelectorAll('.tm-section');
  const cards      = document.querySelectorAll('.tm-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // 섹션 표시/숨김
      sections.forEach(sec => {
        const id = sec.id.replace('sec-', '');
        const show = filter === 'all' || filter === id;
        sec.style.display = show ? '' : 'none';
      });

      // 카드 stagger 재애니메이션
      let delay = 0;
      cards.forEach(card => {
        const team = card.dataset.team;
        const show = filter === 'all' || filter === team;
        if (!show) return;

        card.style.opacity   = '0';
        card.style.transform = 'translateY(12px) scale(0.98)';
        const d = delay;
        setTimeout(() => {
          card.style.opacity   = '';
          card.style.transform = '';
          card.classList.add('visible');
        }, d);
        delay += 45;
      });
    });
  });
})();


/* ════════ 카드 스크롤 reveal ════════ */
(function () {
  const sections = document.querySelectorAll('.tm-section');
  const cards    = document.querySelectorAll('.tm-card');

  // 섹션 reveal
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      secObs.unobserve(e.target);

      // 해당 섹션 안의 카드 stagger
      const secCards = [...e.target.querySelectorAll('.tm-card')];
      secCards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 70);
      });
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(s => secObs.observe(s));

  // 초기에 화면에 보이는 카드
  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight) card.classList.add('visible');
  });
})();


/* ════════ 필터 탭 스크롤 시 하이라이트 ════════ */
(function () {
  const filterBtns = document.querySelectorAll('.tm-flt[data-filter]');
  const sections   = document.querySelectorAll('.tm-section');
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80'
  );
  const filterH = document.querySelector('.tm-filter-wrap')?.offsetHeight || 48;
  const offset  = navH + filterH + 20;

  function onScroll() {
    let current = 'all';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= offset + 10) current = sec.id.replace('sec-', '');
    });

    // 전체 탭이 선택된 상태라면 스크롤 스파이 적용
    const activeFlt = document.querySelector('.tm-flt.active');
    if (activeFlt && activeFlt.dataset.filter !== 'all') return;

    filterBtns.forEach(btn => {
      const match = btn.dataset.filter === current
                 || (current === 'all' && btn.dataset.filter === 'all');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ════════ 카드 hover — 미묘한 빛 효과 ════════ */
document.querySelectorAll('.tm-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-4px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});