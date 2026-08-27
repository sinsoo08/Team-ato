/* ══════════════════════════════════
   TEAM 아토 — notice.js
   - 중요 공지: 상단에 별도로 고정 표시 (강조 스타일 적용)
   - 전체 공지: 중요 여부와 무관하게 날짜순으로 표시 (강조 없이 일반 항목으로 다시 등장)
   - 카테고리 탭 필터링 처리
══════════════════════════════════ */

(function () {
  const importantListEl = document.getElementById('noticeImportantList');
  const listEl           = document.getElementById('noticeList');
  const empty             = document.getElementById('ntEmpty');
  const tabs              = document.querySelectorAll('.nt-tab');

  if (!listEl || typeof NOTICE_DATA === 'undefined') return;

  function toDate(d) { return new Date(d.replace(/\./g, '-')); }

  function renderRow(n, opts) {
    opts = opts || {};
    const highlight = opts.highlight && n.important;
    return `
      <li class="notice-item-wrap" data-cat="${n.cat}">
        <a class="notice-item${highlight ? ' notice-item-important' : ''}" href="notice-detail.html?id=${encodeURIComponent(n.id)}">
          ${highlight ? '<span class="notice-pin">📌 중요</span>' : ''}
          <span class="notice-tag notice-tag-${n.cat}">${n.tagLabel}</span>
          <span class="notice-title">${n.title}</span>
          <span class="notice-date">${n.date}</span>
        </a>
      </li>
    `;
  }

  /* 중요 공지: 상단 고정용, 날짜 내림차순, 강조 스타일 적용 */
  const importantNotices = NOTICE_DATA
    .filter(n => n.important)
    .sort((a, b) => toDate(b.date) - toDate(a.date));

  /* 전체 공지: 중요 여부와 관계없이 날짜 내림차순, 강조 없이 일반 항목으로 표시 */
  const allByDate = [...NOTICE_DATA].sort((a, b) => toDate(b.date) - toDate(a.date));

  if (importantListEl) importantListEl.innerHTML = importantNotices.map(n => renderRow(n, { highlight: true })).join('');
  listEl.innerHTML = allByDate.map(n => renderRow(n, { highlight: false })).join('');

  const importantRows = importantListEl ? importantListEl.querySelectorAll('.notice-item-wrap') : [];
  const rows = listEl.querySelectorAll('.notice-item-wrap');

  function applyFilter(cat) {
    let visibleCount = 0;

    importantRows.forEach(row => {
      const match = cat === 'all' || row.dataset.cat === cat;
      row.hidden = !match;
      if (match) visibleCount++;
    });

    rows.forEach(row => {
      const match = cat === 'all' || row.dataset.cat === cat;
      row.hidden = !match;
      if (match) visibleCount++;
    });

    empty.classList.toggle('show', visibleCount === 0);
  }

  /* 카테고리 탭 필터 */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.cat);
    });
  });

  applyFilter('all');
})();


/* ════════ 헤더 파티클 캔버스 ════════ */
(function () {
  const canvas = document.getElementById('ntCanvas');
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
