// data/db.js
// SQLite/외부 DB 없이도 동작하도록 만든 아주 가벼운 JSON 파일 기반 저장소입니다.
// 트래픽이 매우 많아지면 better-sqlite3 나 MongoDB 등으로 교체하는 것을 권장하지만,
// 학교/팀 사이트 규모에는 이 방식이 충분하고 설정이 가장 간단합니다.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

// 최초 실행 시 시드 데이터 (현재 프론트에 하드코딩되어 있던 값들을 그대로 이전)
const DEFAULT_DATA = {
  // 사이트 전체 방문 수
  totalVisits: 0,
  // 페이지별 방문 수 (page key = html 파일명, 확장자 제외)
  pageVisits: {
    main: 0,
    map: 0,
    support: 0,
    team: 0,
    "guidam-police-1": 0,
    "guidam-police-2": 0,
    "missing-color-1": 0,
    "missing-color-2": 0,
    "color-jump": 0,
    lain: 0,
    "the-post": 0,
    "the-coop": 0
  },
  // 맵별 다운로드 수 (기존 프론트에 박혀있던 숫자를 초깃값으로 사용)
  mapDownloads: {
    "missing-color-1": 4102,
    "missing-color-2": 3560,
    "color-jump": 3241,
    lain: 2887,
    "guidam-police-1": 2344,
    "the-coop": 1455,
    "the-post": 1820,
    "guidam-police-2": 987
  }
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    // 파일이 손상된 경우 기본값으로 복구
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb, DEFAULT_DATA };
