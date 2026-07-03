// server.js — TEAM 아토 백엔드
// Node.js + Express | DDoS 방어: helmet + express-rate-limit

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const path       = require("path");
const fs         = require("fs");
const { readDb, writeDb } = require("./data/db");

const app  = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════
// 1. 보안 헤더 (helmet)
//    XSS, clickjacking, MIME sniffing 등 기본 공격 차단
// ══════════════════════════════════════════════
app.use(helmet());

// ══════════════════════════════════════════════
// 2. Render 등 리버스 프록시 환경에서 실제 IP 신뢰
//    (rate limit이 프록시 IP가 아닌 클라이언트 IP 기준으로 동작하게)
// ══════════════════════════════════════════════
app.set("trust proxy", 1);

// ══════════════════════════════════════════════
// 3. Rate Limiting
// ══════════════════════════════════════════════

// ── 전체 앱 공통: IP당 1분에 100회 초과 시 차단
//    DDoS처럼 동시에 수백~수천 요청을 퍼붓는 것을 막는 1차 방어선
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1분
  max: 100,              // IP당 최대 100회
  standardHeaders: true, // 응답 헤더에 남은 횟수 표시 (RateLimit-*)
  legacyHeaders: false,
  message: { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});

app.use(limiter); // 모든 요청에 적용

// ── 파일 다운로드 전용: IP당 10분에 10회 (맵 ZIP은 용량이 커서 더 타이트하게)
const downloadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10분
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "다운로드 요청이 너무 많습니다. 10분 후 다시 시도해주세요." },
});

// ══════════════════════════════════════════════
// 4. CORS / JSON 파싱
// ══════════════════════════════════════════════
// 배포 후 FRONT_ORIGIN 환경변수에 실제 프론트 주소를 넣어주세요.
// 예: FRONT_ORIGIN=https://teamato.onrender.com
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "*";
app.use(cors({ origin: FRONT_ORIGIN }));
app.use(express.json());

// ══════════════════════════════════════════════
// 5. 알려진 페이지/맵 ID
// ══════════════════════════════════════════════
const KNOWN_PAGES = [
  "main", "map", "support", "team",
  "guidam-police-1", "guidam-police-2",
  "missing-color-1", "missing-color-2",
  "color-jump", "lain", "the-post", "the-coop",
];

// ══════════════════════════════════════════════
// 6. 방문수 기록  POST /api/visit/:page
// ══════════════════════════════════════════════
app.post("/api/visit/:page", (req, res) => {
  const { page } = req.params;
  const db = readDb();
  db.pageVisits[page] = (db.pageVisits[page] || 0) + 1;
  db.totalVisits += 1;
  writeDb(db);
  res.json({ ok: true, page, pageVisits: db.pageVisits[page], totalVisits: db.totalVisits });
});

// ══════════════════════════════════════════════
// 7. 다운로드수 기록  POST /api/download/:mapId
// ══════════════════════════════════════════════
app.post("/api/download/:mapId", (req, res) => {
  const { mapId } = req.params;
  const db = readDb();
  db.mapDownloads[mapId] = (db.mapDownloads[mapId] || 0) + 1;
  writeDb(db);
  res.json({ ok: true, mapId, downloads: db.mapDownloads[mapId] });
});

// ══════════════════════════════════════════════
// 8. 통계 조회
// ══════════════════════════════════════════════
app.get("/api/stats", (req, res) => {
  const db = readDb();
  const totalDownloads = Object.values(db.mapDownloads).reduce((s, n) => s + n, 0);
  res.json({ totalVisits: db.totalVisits, totalDownloads, pageVisits: db.pageVisits, mapDownloads: db.mapDownloads });
});

app.get("/api/stats/map/:mapId", (req, res) => {
  const { mapId } = req.params;
  const db = readDb();
  res.json({ mapId, downloads: db.mapDownloads[mapId] || 0 });
});

app.get("/api/stats/page/:page", (req, res) => {
  const { page } = req.params;
  const db = readDb();
  res.json({ page, visits: db.pageVisits[page] || 0 });
});

// ══════════════════════════════════════════════
// 9. 맵 파일 다운로드  GET /api/maps/download/:mapId
// ══════════════════════════════════════════════
const MAPS_DIR = path.join(__dirname, "uploads", "maps");

const MAP_FILES = {
  "guidam-police-1":       "귀담경찰 시즌 1.zip",
  "guidam-police-2":       "귀담경찰 시즌 2.zip",
  "missing-color-1":       "MISSING COLOR 1.zip",
  "missing-color-2":       "MISSING COLOR 2.zip",
  "color-jump":            "C O L O R J U M P.zip",
  "lain":                  "LAIN.zip",
  "the-coop":              "THE CO_OP.zip",
  "the-post-normal":       "The Post NORMAL V1.223.zip",
  "the-post-hard":         "The Post HARD V1.223.zip",
  "the-post-very-hard":    "The Post VERY HARD V1.3.zip",
  "the-post-extreme-hard": "The Post EXTREME HARD V1.4.zip",
};

app.get("/api/maps/download/:mapId", downloadLimiter, (req, res) => {
  const { mapId } = req.params;
  const { difficulty } = req.query;

  const key = (mapId === "the-post" && difficulty) ? `the-post-${difficulty}` : mapId;
  const filename = MAP_FILES[key];

  if (!filename) return res.status(404).json({ error: `'${key}' 에 해당하는 파일이 없습니다.` });

  const filePath = path.join(MAPS_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: `파일을 찾을 수 없습니다: ${filename}` });

  const db = readDb();
  db.mapDownloads[mapId] = (db.mapDownloads[mapId] || 0) + 1;
  writeDb(db);

  res.download(filePath, filename);
});

// ══════════════════════════════════════════════
// 10. 리소스팩 파일 다운로드  GET /api/resource/download
// ══════════════════════════════════════════════
const RESOURCE_DIR = path.join(__dirname, "uploads", "resources");

app.get("/api/resource/download", downloadLimiter, (req, res) => {
  if (!fs.existsSync(RESOURCE_DIR)) {
    return res.status(404).json({ error: "backend/uploads/resources/ 폴더가 없습니다." });
  }
  const files = fs.readdirSync(RESOURCE_DIR).filter(f => !f.startsWith(".") && f !== "README.txt");
  if (!files.length) return res.status(404).json({ error: "리소스 파일이 없습니다." });
  res.download(path.join(RESOURCE_DIR, files[0]), files[0]);
});

// ══════════════════════════════════════════════
// 11. 프론트 정적 파일 서빙 (선택)
//     frontend/ 폴더를 backend 안에 넣으면 같은 서버로 서빙 가능
// ══════════════════════════════════════════════
const FRONTEND_DIR = path.join(__dirname, "frontend");
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
}

// ══════════════════════════════════════════════
// 12. 서버 시작
// ══════════════════════════════════════════════
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ TEAM 아토 백엔드 실행 중: http://localhost:${PORT}`);
  console.log(`   통계: http://localhost:${PORT}/api/stats`);
});

process.on("uncaughtException", (err) => {
  console.error("❌ 처리되지 않은 에러:", err);
});
