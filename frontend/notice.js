/* ══════════════════════════════════
   TEAM 아토 — notice.js
   notice-data.js 의 NOTICE_DATA 를 읽어 목록을 렌더링하고
   카테고리 탭 필터링을 처리합니다.
══════════════════════════════════ */

(function () {
  const listEl = document.getElementById('noticeList');
  const empty  = document.getElementById('ntEmpty');
  const tabs   = document.querySelectorAll('.nt-tab');

  if (!listEl || typeof NOTICE_DATA === 'undefined') return;

  /* ─ 목록 렌더링 ─ */
  listEl.innerHTML = NOTICE_DATA.map(n => `
    <li class="notice-item-wrap" data-cat="${n.cat}">
      <a class="notice-item${n.important ? ' notice-item-important' : ''}" href="notice-detail.html?id=${encodeURIComponent(n.id)}">
        ${n.important ? '<span class="notice-pin">📌 중요</span>' : ''}
        <span class="notice-tag notice-tag-${n.cat}">${n.tagLabel}</span>
        <span class="notice-title">${n.title}</span>
        <span class="notice-date">${n.date}</span>
      </a>
    </li>
  `).join('');

  const rows = listEl.querySelectorAll('.notice-item-wrap');

  /* ─ 카테고리 필터 ─ */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      let visibleCount = 0;

      rows.forEach(row => {
        const match = cat === 'all' || row.dataset.cat === cat;
        row.hidden = !match;
        if (match) visibleCount++;
      });

      empty.classList.toggle('show', visibleCount === 0);
    });
  });
})();
