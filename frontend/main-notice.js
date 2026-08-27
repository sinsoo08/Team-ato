/* ══════════════════════════════════
   TEAM 아토 — main-notice.js
   메인페이지 공지사항 미리보기를 렌더링합니다.
   정렬 규칙(notice-data.js의 sortNotices): 중요 공지 우선 → 최신순
   위에서부터 4개까지만 보여줍니다.
══════════════════════════════════ */

(function () {
  const listEl = document.getElementById('mainNoticeList');
  if (!listEl || typeof NOTICE_DATA === 'undefined' || typeof sortNotices === 'undefined') return;

  const MAX_ITEMS = 4;
  const notices = sortNotices(NOTICE_DATA).slice(0, MAX_ITEMS);

  listEl.innerHTML = notices.map(n => `
    <li class="notice-item-wrap">
      <a class="notice-item${n.important ? ' notice-item-important' : ''}" href="notice-detail.html?id=${encodeURIComponent(n.id)}">
        ${n.important ? '<span class="notice-pin">📌 중요</span>' : ''}
        <span class="notice-tag notice-tag-${n.cat}">${n.tagLabel}</span>
        <span class="notice-title">${n.title}</span>
        <span class="notice-date">${n.date}</span>
      </a>
    </li>
  `).join('');
})();
