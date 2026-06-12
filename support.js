/* ══════════════════════════════════
   TEAM 아토 — support.js
══════════════════════════════════ */

/* ════════ 헤더 파티클 캔버스 ════════ */
(function () {
  const canvas = document.getElementById('spCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#dbeafe'];
  const dots = Array.from({ length: 45 }, () => mkDot());

  function mkDot(fromBottom = false) {
    return {
      x: Math.random() * canvas.width,
      y: fromBottom ? canvas.height + 6 : Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.5 + 0.15),
      life: Math.random(),
      alpha: Math.random() * 0.45 + 0.08,
    };
  }

  (function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy; d.life += 0.003;
      const fade = Math.sin(d.life * Math.PI);
      ctx.save();
      ctx.globalAlpha = fade * d.alpha;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (d.life >= 1 || d.y < -8) dots[i] = mkDot(true);
    });
    requestAnimationFrame(frame);
  })();
})();


/* ════════ 검색 기능 ════════ */
(function () {
  const input      = document.getElementById('searchInput');
  const clearBtn   = document.getElementById('searchClear');
  const sugBox     = document.getElementById('suggestions');
  const faqBody    = document.getElementById('faqBody');
  const srResults  = document.getElementById('searchResults');

  // 모든 FAQ 아이템 수집
  const allItems = [...document.querySelectorAll('.sp-item')];

  // 검색 제안 데이터 (자주 쓰는 키워드)
  const SUGGESTIONS = [
    { icon: '📦', text: '맵 설치 방법', cat: '설치 & 실행' },
    { icon: '🎮', text: '어떤 버전으로 플레이하나요', cat: '설치 & 실행' },
    { icon: '🐛', text: '버그 신고하기', cat: '버그 & 오류' },
    { icon: '📺', text: '방송에 사용해도 되나요', cat: '이용 규정' },
    { icon: '🤝', text: '멀티플레이 방법', cat: '멀티플레이' },
    { icon: '💎', text: 'Patreon 후원 방법', cat: '후원' },
    { icon: '📋', text: '재배포 및 수정 가능 여부', cat: '이용 규정' },
    { icon: '💬', text: '팀원 합류 문의', cat: '기타 문의' },
  ];

  function showSuggestions(q) {
    const filtered = SUGGESTIONS.filter(s =>
      s.text.includes(q) || s.cat.includes(q)
    ).slice(0, 5);

    if (!filtered.length || !q) { sugBox.classList.remove('show'); return; }

    sugBox.innerHTML = filtered.map(s => `
      <div class="sp-sug-item" data-q="${s.text}">
        <span class="sp-sug-icon">${s.icon}</span>
        <span>${highlight(s.text, q)}</span>
        <span class="sp-sug-cat">${s.cat}</span>
      </div>
    `).join('');
    sugBox.classList.add('show');

    sugBox.querySelectorAll('.sp-sug-item').forEach(el => {
      el.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = el.dataset.q;
        runSearch(el.dataset.q);
        sugBox.classList.remove('show');
      });
    });
  }

  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function runSearch(q) {
    const trimmed = q.trim().toLowerCase();
    clearBtn.classList.toggle('show', !!trimmed);

    if (!trimmed) {
      // 검색 초기화
      srResults.classList.remove('show');
      srResults.innerHTML = '';
      allItems.forEach(it => {
        it.classList.remove('sp-highlight', 'sp-dim');
      });
      document.querySelectorAll('.sp-group').forEach(g => g.style.display = '');
      return;
    }

    // 매칭 아이템 찾기
    const matched = allItems.filter(it => {
      const kw  = (it.dataset.keywords || '').toLowerCase();
      const q_  = it.querySelector('.sp-q')?.textContent.toLowerCase() || '';
      const a_  = it.querySelector('.sp-a-inner')?.textContent.toLowerCase() || '';
      return kw.includes(trimmed) || q_.includes(trimmed) || a_.includes(trimmed);
    });

    // 검색 결과 헤더
    srResults.innerHTML = `
      <p class="sp-search-results-title">
        "<strong>${q}</strong>" 검색 결과 — ${matched.length}개
      </p>
    `;
    srResults.classList.add('show');

    // 아이템 표시/숨김
    allItems.forEach(it => {
      if (matched.includes(it)) {
        it.classList.add('sp-highlight');
        it.classList.remove('sp-dim');
        it.closest('.sp-group').style.display = '';
      } else {
        it.classList.remove('sp-highlight');
        it.classList.add('sp-dim');
      }
    });

    // 매칭 없는 그룹 숨기기
    document.querySelectorAll('.sp-group').forEach(g => {
      const hasMatch = [...g.querySelectorAll('.sp-item')].some(it => matched.includes(it));
      g.style.display = hasMatch ? '' : 'none';
    });

    // 첫 번째 매칭 항목 열기
    if (matched.length) {
      matched[0].classList.add('open');
    }
  }

  input.addEventListener('input', e => {
    showSuggestions(e.target.value);
    runSearch(e.target.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      sugBox.classList.remove('show');
      input.blur();
    }
    if (e.key === 'Enter') {
      sugBox.classList.remove('show');
      runSearch(input.value);
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.sp-search-wrap')) {
      sugBox.classList.remove('show');
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    runSearch('');
    input.focus();
  });

  // mark 스타일
  const style = document.createElement('style');
  style.textContent = 'mark { background:#dbeafe; color:var(--blue); border-radius:2px; padding:0 2px; }';
  document.head.appendChild(style);
})();


/* ════════ 카테고리 카드 클릭 → 스크롤 ════════ */
document.querySelectorAll('.sp-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    const target = document.getElementById('cat-' + cat);
    if (!target) return;

    // 활성 표시
    document.querySelectorAll('.sp-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 스크롤
    const y = target.getBoundingClientRect().top + window.scrollY
            - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80') - 24;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // 첫 번째 항목 자동으로 열기
    const first = target.querySelector('.sp-item');
    if (first && !first.classList.contains('open')) first.classList.add('open');
  });
});


/* ════════ FAQ 아코디언 ════════ */
document.querySelectorAll('.sp-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.sp-item');
    const isOpen = item.classList.contains('open');
    // 같은 그룹 내 다른 항목 닫기
    const group = item.closest('.sp-items');
    group.querySelectorAll('.sp-item.open').forEach(i => {
      if (i !== item) i.classList.remove('open');
    });
    item.classList.toggle('open', !isOpen);
  });
});


/* ════════ 사이드 TOC 스크롤 스파이 ════════ */
(function () {
  const links  = document.querySelectorAll('.sp-toc-link');
  const groups = document.querySelectorAll('.sp-group');
  if (!links.length || !groups.length) return;

  const navH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h') || '80') + 32;

  function onScroll() {
    let current = '';
    groups.forEach(g => {
      if (g.getBoundingClientRect().top <= navH) current = g.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ════════ 카드 스크롤 reveal ════════ */
(function () {
  const els = document.querySelectorAll('.sp-cat, .sp-group');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('sp-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  // 초기 스타일
  const style = document.createElement('style');
  style.textContent = `
    .sp-cat, .sp-group {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .sp-cat.sp-visible, .sp-group.sp-visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(style);

  els.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 55 + 'ms';
    obs.observe(el);
  });
})();