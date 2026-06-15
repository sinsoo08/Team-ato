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

      // 부드러운 페이드인 → 유지 → 페이드아웃
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


/* ════════════════════════════════════
   질문 게시판
════════════════════════════════════ */
(function () {

  /* ── 샘플 초기 데이터 ── */
  const SAMPLE_POSTS = [
    {
      id: 1, nick: '크리퍼헌터', cat: '설치 & 실행',
      title: 'MISSING COLOR 1이 세계 목록에 안 보여요',
      body: '다운로드 후 saves 폴더에 넣었는데 싱글플레이 목록에 아무것도 안 나와요. 폴더 안에 폴더가 하나 더 있는 건가요?',
      time: Date.now() - 1000 * 60 * 60 * 3,
      answered: true,
    },
    {
      id: 2, nick: '엔더드래곤', cat: '버그 & 오류',
      title: '귀담경찰 2 특정 구간에서 문이 안 열려요',
      body: '3챕터 초반부에서 불이 켜지고 나면 진행이 막힙니다. 다시 시작해도 동일하게 막히네요.',
      time: Date.now() - 1000 * 60 * 30,
      answered: false,
    },
    {
      id: 3, nick: '스티브123', cat: '멀티플레이',
      title: 'THE CO-OP을 3명이서 해도 되나요?',
      body: '친구 둘이랑 같이 하고 싶어서요. 3명이서 해도 커맨드 블록이 정상 작동하는지 궁금합니다.',
      time: Date.now() - 1000 * 60 * 60 * 24,
      answered: false,
    },
  ];

  /* ── 스토리지 (localStorage 폴백) ── */
  const STORAGE_KEY = 'teamato_posts';

  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : SAMPLE_POSTS;
    } catch { return SAMPLE_POSTS; }
  }

  function savePosts(posts) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch {}
  }

  let posts = loadPosts();
  let currentTab = 'all';

  /* ── 시간 포맷 ── */
  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1)  return '방금 전';
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    const d = Math.floor(h / 24);
    return `${d}일 전`;
  }

  /* ── 게시글 렌더링 ── */
  const postList  = document.getElementById('postList');
  const boardEmpty = document.getElementById('boardEmpty');

  function renderPosts() {
    const filtered = posts.filter(p => {
      if (currentTab === 'answered')   return p.answered;
      if (currentTab === 'unanswered') return !p.answered;
      return true;
    });

    postList.innerHTML = '';
    boardEmpty.style.display = filtered.length ? 'none' : 'flex';

    filtered.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'sp-post';
      el.style.animationDelay = i * 45 + 'ms';
      el.innerHTML = `
        <div class="sp-post-status">
          <span class="sp-status-dot ${p.answered ? 'answered' : 'unanswered'}" title="${p.answered ? '답변 완료' : '미답변'}"></span>
        </div>
        <div class="sp-post-main">
          <div class="sp-post-top">
            <span class="sp-post-cat">${p.cat}</span>
            <span class="sp-post-title">${escHtml(p.title)}</span>
          </div>
          <div class="sp-post-preview">${escHtml(p.body)}</div>
          <div class="sp-post-foot">
            <span class="sp-post-nick">👤 ${escHtml(p.nick)}</span>
            <span class="sp-post-time">${timeAgo(p.time)}</span>
            ${p.answered ? '<span class="sp-post-answered-badge">✓ 답변 완료</span>' : ''}
          </div>
        </div>
      `;
      el.addEventListener('click', () => openDetail(p));
      postList.appendChild(el);
    });
  }

  /* ── 이스케이프 ── */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── 탭 ── */
  document.querySelectorAll('.sp-btab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sp-btab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderPosts();
    });
  });

  /* ════════ 작성 모달 ════════ */
  const postModal  = document.getElementById('postModal');
  const openBtn    = document.getElementById('openPostModal');
  const closeBtn   = document.getElementById('closePostModal');
  const cancelBtn  = document.getElementById('cancelPost');
  const submitBtn  = document.getElementById('submitPost');

  const fName    = document.getElementById('postName');
  const fCat     = document.getElementById('postCat');
  const fTitle   = document.getElementById('postTitle');
  const fBody    = document.getElementById('postBody');
  const titleCnt = document.getElementById('titleCount');
  const bodyCnt  = document.getElementById('bodyCount');

  function openModal()  { postModal.classList.add('open'); document.body.style.overflow = 'hidden'; fName.focus(); }
  function closeModal() { postModal.classList.remove('open'); document.body.style.overflow = ''; resetForm(); }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  postModal.addEventListener('click', e => { if (e.target === postModal) closeModal(); });

  fTitle.addEventListener('input', () => { titleCnt.textContent = `${fTitle.value.length} / 60`; });
  fBody.addEventListener('input',  () => { bodyCnt.textContent  = `${fBody.value.length} / 1000`; });

  function resetForm() {
    [fName, fCat, fTitle, fBody].forEach(f => {
      f.value = '';
      f.classList.remove('error');
    });
    titleCnt.textContent = '0 / 60';
    bodyCnt.textContent  = '0 / 1000';
  }

  function validate() {
    let ok = true;
    [fName, fCat, fTitle, fBody].forEach(f => {
      if (!f.value.trim()) { f.classList.add('error'); ok = false; }
      else f.classList.remove('error');
    });
    return ok;
  }

  submitBtn.addEventListener('click', () => {
    if (!validate()) {
      shakeModal();
      return;
    }
    const newPost = {
      id: Date.now(),
      nick:     fName.value.trim(),
      cat:      fCat.value,
      title:    fTitle.value.trim(),
      body:     fBody.value.trim(),
      time:     Date.now(),
      answered: false,
    };
    posts.unshift(newPost);
    savePosts(posts);
    closeModal();
    renderPosts();
    showToast('✅ 질문이 등록되었습니다!');
  });

  function shakeModal() {
    const m = postModal.querySelector('.sp-modal');
    m.style.animation = 'none';
    m.offsetHeight;
    m.style.animation = 'modalShake 0.35s ease';
  }

  // shake keyframe
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes modalShake {
      0%,100% { transform: none; }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ════════ 상세 모달 ════════ */
  const detailModal = document.getElementById('detailModal');
  const detailMeta  = document.getElementById('detailMeta');
  const detailBody  = document.getElementById('detailBody');
  const closeDetail = document.getElementById('closeDetailModal');

  function openDetail(p) {
    detailMeta.innerHTML = `
      <span class="sp-detail-cat">${escHtml(p.cat)}</span>
      <span class="sp-detail-title">${escHtml(p.title)}</span>
    `;
    detailBody.innerHTML = `
      <div class="sp-detail-info">
        <span>👤 ${escHtml(p.nick)}</span>
        <span>${timeAgo(p.time)}</span>
        ${p.answered ? '<span style="color:#10b981;font-weight:600">✓ 답변 완료</span>' : '<span style="color:#f59e0b;font-weight:600">⏳ 미답변</span>'}
      </div>
      <div class="sp-detail-content">${escHtml(p.body)}</div>
      <div class="sp-no-reply">
        💬 답변은 <a href="https://discord.gg/2zyZtytDbK" target="_blank" style="color:var(--blue);font-weight:600;">디스코드</a>에서 빠르게 받아보실 수 있습니다.
      </div>
    `;
    detailModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDetail.addEventListener('click', () => {
    detailModal.classList.remove('open');
    document.body.style.overflow = '';
  });
  detailModal.addEventListener('click', e => {
    if (e.target === detailModal) {
      detailModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ESC 키 모달 닫기 */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (postModal.classList.contains('open'))   closeModal();
    if (detailModal.classList.contains('open')) {
      detailModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ════════ 토스트 ════════ */
  const toast = document.createElement('div');
  toast.className = 'sp-toast';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* ── 초기 렌더 ── */
  renderPosts();

})();