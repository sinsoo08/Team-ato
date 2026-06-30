// analytics.js
// 모든 html 파일에 아래 한 줄만 추가하면 됩니다.
//   <script src="analytics.js" data-page="main"></script>
// data-page 값은 해당 페이지의 id 입니다.
// (main, map, support, team, guidam-police-1, guidam-police-2,
//  missing-color-1, missing-color-2, color-jump, lain, the-post, the-coop)

(function () {
  // 백엔드 서버 주소 — 배포 후 실제 주소로 바꿔주세요.
  // 예: const API_BASE = "https://team-ato-api.onrender.com";
  const API_BASE = "http://localhost:3000";

  const scriptTag = document.currentScript;
  const page = scriptTag ? scriptTag.getAttribute("data-page") : null;

  // 1) 페이지 방문수 기록 (페이지 로드 시 1회)
  if (page) {
    fetch(`${API_BASE}/api/visit/${page}`, { method: "POST" }).catch(() => {
      // 백엔드가 꺼져 있어도 프론트 동작에는 영향 없도록 무시
    });
  }

  // 2) 다운로드 버튼 클릭 시 다운로드수 기록
  //    class="js-dl-track" 와 data-map-id="맵id" 를 다운로드 버튼(<a>)에 추가해두면
  //    클릭 시 자동으로 백엔드에 +1 기록 후 원래 링크로 이동합니다.
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-dl-track");
    if (!btn) return;

    const mapId = btn.getAttribute("data-map-id");
    if (!mapId) return;

    // 페이지 이동을 막지 않고, 기록 요청만 비동기로 같이 보냄
    fetch(`${API_BASE}/api/download/${mapId}`, {
      method: "POST",
      keepalive: true // 새 탭/페이지 이동 중에도 요청이 끊기지 않도록
    }).catch(() => {});
  });

  // 3) 통계 숫자를 화면에 자동으로 채워주는 헬퍼
  //    예: <span class="js-stat-total-dl"></span>  → 전체 다운로드수
  //        <span class="js-stat-map-dl" data-map-id="the-post"></span> → 특정 맵 다운로드수
  //        <span class="js-stat-page-visit" data-page="main"></span>  → 특정 페이지 방문수
  function fillStats() {
    fetch(`${API_BASE}/api/stats`)
      .then((r) => r.json())
      .then((stats) => {
        document.querySelectorAll(".js-stat-total-dl").forEach((el) => {
          el.textContent = stats.totalDownloads.toLocaleString();
        });
        document.querySelectorAll(".js-stat-total-visit").forEach((el) => {
          el.textContent = stats.totalVisits.toLocaleString();
        });
        document.querySelectorAll(".js-stat-map-dl").forEach((el) => {
          const id = el.getAttribute("data-map-id");
          if (id && stats.mapDownloads[id] !== undefined) {
            el.textContent = stats.mapDownloads[id].toLocaleString();
          }
        });
        document.querySelectorAll(".js-stat-page-visit").forEach((el) => {
          const id = el.getAttribute("data-page");
          if (id && stats.pageVisits[id] !== undefined) {
            el.textContent = stats.pageVisits[id].toLocaleString();
          }
        });
      })
      .catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillStats);
  } else {
    fillStats();
  }
})();
