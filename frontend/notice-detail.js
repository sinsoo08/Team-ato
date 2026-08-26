/* ══════════════════════════════════
   TEAM 아토 — notice-detail.js
   URL의 ?id= 값으로 NOTICE_DATA(notice-data.js)에서 해당 공지를 찾아
   상세 내용을 렌더링합니다.
══════════════════════════════════ */

(function () {
  const articleEl = document.getElementById('ndArticle');
  const relatedEl = document.getElementById('ndRelated');
  if (!articleEl || typeof NOTICE_DATA === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const idx = NOTICE_DATA.findIndex(n => n.id === id);
  const notice = idx !== -1 ? NOTICE_DATA[idx] : null;

  document.title = notice
    ? `${notice.title} — TEAM 아토 OFFICIAL`
    : '공지사항을 찾을 수 없습니다 — TEAM 아토 OFFICIAL';

  if (!notice) {
    if (relatedEl) relatedEl.innerHTML = '';
    articleEl.innerHTML = `
      <div class="nd-notfound">
        <p class="nd-notfound-title">해당 공지사항을 찾을 수 없습니다.</p>
        <p class="nd-notfound-desc">주소가 잘못되었거나 삭제된 공지일 수 있습니다.</p>
        <a href="notice.html" class="nd-notfound-btn">공지사항 목록으로 돌아가기</a>
      </div>
    `;
    return;
  }

  /* ─ 목록은 최신순으로 정렬되어 있으므로
     이전글(더 오래된 글) = idx+1, 다음글(더 최신 글) = idx-1 ─ */
  const prevPost   = NOTICE_DATA[idx + 1] || null; // 이전글 (더 오래된 글)
  const nextPost   = idx > 0 ? NOTICE_DATA[idx - 1] : null; // 다음글 (더 최신 글)
  const latestPost = NOTICE_DATA[0];
  const isLatest   = latestPost.id === notice.id;

  function row(label, post, opts) {
    opts = opts || {};
    if (!post) {
      return `
        <li class="nd-nav-row nd-nav-empty">
          <span class="nd-nav-label">${label}</span>
          <span class="nd-nav-title">${opts.emptyText || '없음'}</span>
        </li>
      `;
    }
    if (opts.current) {
      return `
        <li class="nd-nav-row nd-nav-current">
          <span class="nd-nav-label">${label}</span>
          <span class="nd-nav-title">${post.title}</span>
          <span class="nd-nav-date">${post.date}</span>
        </li>
      `;
    }
    return `
      <li class="nd-nav-row">
        <span class="nd-nav-label">${label}</span>
        <a class="nd-nav-title" href="notice-detail.html?id=${encodeURIComponent(post.id)}">${post.title}${opts.tag ? ` <em>${opts.tag}</em>` : ''}</a>
        <span class="nd-nav-date">${post.date}</span>
      </li>
    `;
  }

  relatedEl.innerHTML = `
    <ul class="nd-nav-list">
      ${row('현재글', notice, { current: true })}
      ${row('이전글', prevPost, { emptyText: '이전글이 없습니다' })}
      ${row('다음글', nextPost, { emptyText: '다음글이 없습니다' })}
      ${row('최신글', latestPost, { tag: isLatest ? '(현재 글)' : '' })}
    </ul>
  `;

  const bodyHtml = notice.body.map(p => `<p>${p}</p>`).join('');

  articleEl.innerHTML = `
    <header class="nd-head">
      <div class="nd-head-top">
        ${notice.important ? '<span class="notice-pin">📌 중요</span>' : ''}
        <span class="notice-tag notice-tag-${notice.cat}">${notice.tagLabel}</span>
        <span class="nd-date">${notice.date}</span>
      </div>
      <h1 class="nd-title">${notice.title}</h1>
    </header>
    <div class="nd-body">
      ${bodyHtml}
    </div>
  `;
})();
