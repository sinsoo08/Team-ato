// server.js
// TEAM 아토 사이트 통계(방문수 / 다운로드수) 백엔드 API 서버
//
// 실행 방법
//   1) npm install
//   2) npm start   (기본 포트 3000, PORT 환경변수로 변경 가능)
//
// 제공 API
//   POST /api/visit/:page         해당 페이지 방문수 +1, 사이트 전체 방문수 +1
//   POST /api/download/:mapId     해당 맵 다운로드수 +1
//   GET  /api/stats               전체 통계 (총 방문수, 총 다운로드수, 페이지별/맵별 상세)
//   GET  /api/stats/map/:mapId    특정 맵의 다운로드수만 조회

const express = require("express");
const cors = require("cors");
const path = require("path");
const { readDb, writeDb } = require("./data/db");

const app = express();
const PORT = process.env.PORT || 3000;

// 프론트가 다른 도메인/포트에서 fetch 요청을 보낼 수도 있으므로 CORS 허용
// 배포 시에는 origin을 실제 프론트 주소로 좁혀주는 것을 권장합니다.
app.use(cors());
app.use(express.json());

// 알려진 페이지/맵 id 목록 (프론트 파일명과 1:1로 매칭)
const KNOWN_PAGES = [
  "main",
  "map",
  "support",
  "team",
  "guidam-police-1",
  "guidam-police-2",
  "missing-color-1",
  "missing-color-2",
  "color-jump",
  "lain",
  "the-post",
  "the-coop"
];

const KNOWN_MAPS = [
  "missing-color-1",
  "missing-color-2",
  "color-jump",
  "lain",
  "guidam-police-1",
  "the-coop",
  "the-post",
  "guidam-police-2"
];

// ───────────────────────────────────────────────
// 방문수 기록
// 프론트 각 페이지 로드 시 1회 호출하도록 연동합니다.
// ───────────────────────────────────────────────
app.post("/api/visit/:page", (req, res) => {
  const { page } = req.params;

  if (!KNOWN_PAGES.includes(page)) {
    // 모르는 페이지여도 일단 기록은 받아주되, pageVisits 객체에 새로 추가
    const db = readDb();
    db.pageVisits[page] = (db.pageVisits[page] || 0) + 1;
    db.totalVisits += 1;
    writeDb(db);
    return res.json({
      ok: true,
      page,
      pageVisits: db.pageVisits[page],
      totalVisits: db.totalVisits,
      note: "등록되지 않은 page id 였지만 새로 추가했습니다."
    });
  }

  const db = readDb();
  db.pageVisits[page] = (db.pageVisits[page] || 0) + 1;
  db.totalVisits += 1;
  writeDb(db);

  res.json({
    ok: true,
    page,
    pageVisits: db.pageVisits[page],
    totalVisits: db.totalVisits
  });
});

// ───────────────────────────────────────────────
// 다운로드수 기록
// "맵 다운로드" 버튼 클릭 시 호출하도록 연동합니다.
// ───────────────────────────────────────────────
app.post("/api/download/:mapId", (req, res) => {
  const { mapId } = req.params;
  const db = readDb();

  db.mapDownloads[mapId] = (db.mapDownloads[mapId] || 0) + 1;
  writeDb(db);

  res.json({
    ok: true,
    mapId,
    downloads: db.mapDownloads[mapId]
  });
});

// ───────────────────────────────────────────────
// 전체 통계 조회
// map.html 상단 통계 바, support.html 등에서 사용
// ───────────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  const db = readDb();
  const totalDownloads = Object.values(db.mapDownloads).reduce(
    (sum, n) => sum + n,
    0
  );

  res.json({
    totalVisits: db.totalVisits,
    totalDownloads,
    pageVisits: db.pageVisits,
    mapDownloads: db.mapDownloads
  });
});

// 특정 맵 다운로드수만 조회 (상세 페이지에서 사용)
app.get("/api/stats/map/:mapId", (req, res) => {
  const { mapId } = req.params;
  const db = readDb();
  res.json({
    mapId,
    downloads: db.mapDownloads[mapId] || 0
  });
});

// 특정 페이지 방문수만 조회
app.get("/api/stats/page/:page", (req, res) => {
  const { page } = req.params;
  const db = readDb();
  res.json({
    page,
    visits: db.pageVisits[page] || 0
  });
});

// ───────────────────────────────────────────────
// 리소스팩 파일 다운로드
// backend/uploads/resources/ 폴더 안의 파일을 서빙합니다.
// ───────────────────────────────────────────────
const RESOURCE_DIR = path.join(__dirname, "uploads", "resources");

app.get("/api/resource/download", (req, res) => {
  const fs = require("fs");
  if (!fs.existsSync(RESOURCE_DIR)) {
    return res.status(404).json({ error: "리소스 폴더가 없습니다. backend/uploads/resources/ 에 파일을 넣어주세요." });
  }
  const files = fs.readdirSync(RESOURCE_DIR).filter(f => !f.startsWith("."));
  if (files.length === 0) {
    return res.status(404).json({ error: "리소스 파일이 없습니다." });
  }
  const filePath = path.join(RESOURCE_DIR, files[0]);
  res.download(filePath, files[0]);
});

// ───────────────────────────────────────────────
// 정적 파일(프론트) 서빙 — 선택 사항
// 백엔드와 프론트를 같은 서버에서 같이 띄우고 싶을 때 사용합니다.
// /mnt 구조와 동일하게 frontend 폴더를 만들어 html/css/js를 넣으면
// http://localhost:3000/main.html 로 접속할 수 있습니다.
// ───────────────────────────────────────────────
const FRONTEND_DIR = path.join(__dirname, "frontend");
app.use(express.static(FRONTEND_DIR));

// '0.0.0.0'을 명시해서 IPv4로 명확하게 바인딩합니다.
// (host를 생략하면 환경에 따라 IPv6(::)로만 열려서 localhost 접속이 안 되는 경우가 있습니다)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ TEAM 아토 백엔드 서버 실행 중: http://localhost:${PORT}`);
  console.log(`   통계 확인: http://localhost:${PORT}/api/stats`);
});

process.on("uncaughtException", (err) => {
  console.error("❌ 처리되지 않은 에러:", err);
});
