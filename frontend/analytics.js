// analytics.js
// TEAM 아토 사이트 ↔ 백엔드 통계 연동 스크립트
//
// 사용법: 각 html 파일 </body> 바로 위에 한 줄만 추가
//   <script src="analytics.js" data-page="main"></script>
//
// 기능
//   1) 페이지 방문수 자동 기록 (로드 시 1회)
//   2) class="js-dl-track" + data-map-id 붙은 다운로드 버튼 클릭 시 다운로드수 +1
//      → 클릭 즉시 화면 숫자도 바로 올라감 (낙관적 업데이트)
//   3] 몇 초마다 백엔드를 polling 해서 모든 사용자 화면의 숫자가 실시간으로 동기화됨
//   4) 숫자가 바뀔 때 휙 바뀌지 않고 부드럽게 카운트업 되도록 애니메이션 처리

(function () {
  // ───────────────────────────────────────────────
  // 0. 설정
  // ───────────────────────────────────────────────
  // 백엔드 서버 주소. 배포 후 실제 주소로 바꿔주세요.
  // 예: const API_BASE = "https://team-ato-api.onrender.com";
  const API_BASE = "http://localhost:3000";
  const POLL_INTERVAL_MS = 5000; // 5초마다 서버와 동기화

  const scriptTag = document.currentScript;
  const page = scriptTag ? scriptTag.getAttribute("data-page") : null;

  // ───────────────────────────────────────────────
  // 1. 방문수 기록 (페이지 로드 시 1회)
  // ───────────────────────────────────────────────
  if (page) {
    fetch(`${API_BASE}/api/visit/${page}`, { method: "POST" }).catch(() => {});
  }

  // ───────────────────────────────────────────────
  // 숫자 부드럽게 올리는 헬퍼
  // 현재 표시된 값 → 목표 값까지 애니메이션으로 채워줌
  // ───────────────────────────────────────────────
  function parseDisplayedNumber(el) {
    const n = parseInt((el.textContent || "0").replace(/[^\d]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  function animateNumber(el, toValue, duration) {
    const fromValue = parseDisplayedNumber(el);
    if (fromValue === toValue) return;

    duration = duration || 800;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(fromValue + (toValue - fromValue) * eased);
      el.textContent = current.toLocaleString("ko-KR");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ───────────────────────────────────────────────
  // 2. 다운로드 버튼 클릭 추적 + 낙관적 업데이트
  // ───────────────────────────────────────────────
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-dl-track");
    if (!btn) return;

    const mapId = btn.getAttribute("data-map-id");
    if (!mapId) return;

    // 같은 맵을 가리키는 모든 숫자 표시 요소를 즉시 +1 (서버 응답 기다리지 않음)
    document
      .querySelectorAll(`.js-stat-map-dl[data-map-id="${mapId}"], [data-map-id="${mapId}"] .js-stat-map-dl`)
      .forEach((el) => {
        const current = parseDisplayedNumber(el);
        animateNumber(el, current + 1, 400);
      });

    // 실제 기록은 백엔드에 비동기로 전송 (페이지 이동을 막지 않음)
    fetch(`${API_BASE}/api/download/${mapId}`, {
      method: "POST",
      keepalive: true
    }).catch(() => {});
  });

  // ───────────────────────────────────────────────
  // 3. 통계 polling → 실시간 동기화
  // ───────────────────────────────────────────────
  function findMapIdFor(el) {
    return (
      el.getAttribute("data-map-id") ||
      (el.closest("[data-map-id]") && el.closest("[data-map-id]").getAttribute("data-map-id"))
    );
  }

  function applyStats(stats) {
    // 전체 다운로드 수
    document.querySelectorAll(".js-stat-total-dl").forEach((el) => {
      // map.html의 #stat-dl 은 처음 화면에 보일 때 0→목표값으로 한 번 카운트업하는
      // 기존 애니메이션(main.js)을 갖고 있으므로, 그 애니메이션이 쓸 목표값(data-to)을
      // 실제 값으로 갱신해주고, 이미 애니메이션이 끝난 뒤(텍스트에 숫자가 보이는 상태)라면
      // 새 값으로 부드럽게 갱신한다.
      el.dataset.to = stats.totalDownloads;
      if (el.dataset.animated === "1" || /\d/.test(el.textContent)) {
        animateNumber(el, stats.totalDownloads, 900);
      }
      el.dataset.animated = "1";
    });

    // 전체 방문 수
    document.querySelectorAll(".js-stat-total-visit").forEach((el) => {
      animateNumber(el, stats.totalVisits, 900);
    });

    // 맵별 다운로드 수
    document.querySelectorAll(".js-stat-map-dl").forEach((el) => {
      const mapId = findMapIdFor(el);
      if (mapId && stats.mapDownloads[mapId] !== undefined) {
        animateNumber(el, stats.mapDownloads[mapId], 900);

        // map.html 카드 정렬(다운로드 많은순)이 실제 값을 기준으로 동작하도록
        // 카드(article)의 data-dl 속성도 같이 갱신
        const card = el.closest("[data-map-id]");
        if (card && card.classList.contains("mc")) {
          card.setAttribute("data-dl", stats.mapDownloads[mapId]);
        }
      }
    });

    // 페이지별 방문 수
    document.querySelectorAll(".js-stat-page-visit").forEach((el) => {
      const pageId = el.getAttribute("data-page");
      if (pageId && stats.pageVisits[pageId] !== undefined) {
        animateNumber(el, stats.pageVisits[pageId], 900);
      }
    });
  }

  function pollStats() {
    fetch(`${API_BASE}/api/stats`)
      .then((r) => r.json())
      .then(applyStats)
      .catch(() => {
        // 백엔드가 꺼져 있어도 프론트 자체 기능에는 영향 없도록 무시
      });
  }

  function start() {
    pollStats(); // 첫 로드 시 1회
    setInterval(pollStats, POLL_INTERVAL_MS); // 이후 주기적으로 polling → 실시간 동기화

    // 다른 탭/창에서 다운로드를 클릭해서 숫자가 바뀐 경우, 현재 탭이 다시 보일 때
    // 곧바로 한 번 더 동기화 (포커스 복귀 시 즉시 반영)
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") pollStats();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
