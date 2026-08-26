/* ══════════════════════════════════
   TEAM 아토 — notice.js (카테고리 필터)
══════════════════════════════════ */

(function () {
  const tabs  = document.querySelectorAll('.nt-tab');
  const items = document.querySelectorAll('#noticeList .notice-item');
  const empty = document.getElementById('ntEmpty');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      let visibleCount = 0;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.cat === cat;
        item.hidden = !match;
        if (match) visibleCount++;
      });

      empty.classList.toggle('show', visibleCount === 0);
    });
  });
})();
