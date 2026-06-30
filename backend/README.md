# TEAM 아토 통계 백엔드

기존 프론트엔드(html/css/js)는 그대로 두고, "다운로드 수"와 "방문 수"를
실제로 기록하고 보여주기 위한 백엔드 API 서버입니다.

DB는 따로 설치할 필요 없이 `data/db.json` 파일 하나로 동작합니다.
(나중에 사용자가 많아지면 better-sqlite3 같은 걸로 바꿔도 되지만, 지금 규모에는 이걸로 충분합니다.)

## 1. 폴더 구조

```
backend/
  server.js          ← 서버 실행 파일
  data/
    db.js            ← 데이터 읽고 쓰는 로직
    db.json          ← 실제 데이터 (서버 처음 실행 시 자동 생성됨)
  public/
    analytics.js      ← 프론트 페이지에 넣을 연동 스크립트
  package.json
```

## 2. 실행 방법

```bash
cd backend
npm install
npm start
```

서버가 뜨면 `http://localhost:3000/api/stats` 에서 현재 통계를 바로 확인할 수 있습니다.

## 3. API 목록

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/visit/:page` | 해당 페이지 방문수 +1 (예: `/api/visit/main`) |
| POST | `/api/download/:mapId` | 해당 맵 다운로드수 +1 (예: `/api/download/the-post`) |
| GET | `/api/stats` | 전체 통계 (총 방문수, 총 다운로드수, 페이지별/맵별 상세) |
| GET | `/api/stats/map/:mapId` | 특정 맵 다운로드수만 |
| GET | `/api/stats/page/:page` | 특정 페이지 방문수만 |

`page` id 목록: `main, map, support, team, guidam-police-1, guidam-police-2, missing-color-1, missing-color-2, color-jump, lain, the-post, the-coop`

`mapId` 목록(다운로드 추적 대상): `missing-color-1, missing-color-2, color-jump, lain, guidam-police-1, the-coop, the-post, guidam-police-2`

## 4. 기존 프론트에 연동하는 방법

### 4-1. 스크립트 추가

각 html 파일의 `</body>` 직전에 한 줄씩 추가합니다. (페이지마다 `data-page` 값만 다르게)

```html
<!-- main.html -->
<script src="analytics.js" data-page="main"></script>

<!-- map.html -->
<script src="analytics.js" data-page="map"></script>

<!-- the-post.html -->
<script src="analytics.js" data-page="the-post"></script>
```

`public/analytics.js` 파일을 프론트 폴더로 복사해서 같이 올리면 됩니다.
(배포 주소가 정해지면 `analytics.js` 안의 `API_BASE` 값을 실제 백엔드 주소로 바꿔주세요.)

이 스크립트 하나만 넣으면 **페이지 로드 시 방문수가 자동으로 기록**됩니다.

### 4-2. 다운로드 버튼에 추적 붙이기

지금 `the-post.html`의 다운로드 버튼은 이런 모양입니다.

```html
<a href="https://did20031.wixsite.com/teamatoofficial/복제-the-post-리옵쉐"
   target="_blank" class="btn-dl-main">
  ↓ 맵 다운로드
</a>
```

여기에 `js-dl-track` 클래스와 `data-map-id`만 추가해주면 클릭할 때마다 자동으로 +1 기록됩니다.
(원래 링크 이동은 그대로 동작하고, 기록만 추가로 같이 보냅니다.)

```html
<a href="https://did20031.wixsite.com/teamatoofficial/복제-the-post-리옵쉐"
   target="_blank" class="btn-dl-main js-dl-track" data-map-id="the-post">
  ↓ 맵 다운로드
</a>
```

다른 맵 상세 페이지들도 똑같이 `class`에 `js-dl-track` 추가, `data-map-id="맵아이디"`만 넣어주면 됩니다.

### 4-3. 화면에 실시간 숫자 표시하기

지금은 숫자가 html에 그냥 텍스트로 박혀있습니다 (예: `⬇ 1,820회`).
이걸 실시간 값으로 바꾸려면 숫자가 들어갈 자리에 클래스를 가진 빈 태그를 넣어주면,
`analytics.js`가 자동으로 채워줍니다.

```html
<!-- the-post.html: 다운로드 카운트 -->
<span class="cover-dl-count">⬇ <span class="js-stat-map-dl" data-map-id="the-post">1,820</span>회</span>

<!-- map.html: 전체 다운로드 통계 -->
<span class="stat-num js-stat-total-dl" data-to="19779">0</span>

<!-- 특정 페이지 방문수를 보여주고 싶을 때 -->
<span class="js-stat-page-visit" data-page="main">0</span>
```

> 참고: map.html은 카운트업 애니메이션(`data-to` 속성을 보고 0부터 올라가는 효과)이 있는 것 같아서,
> 직접 적용할 때는 기존 map.js의 애니메이션 코드와 충돌하지 않는지 한 번 확인해보시는 게 좋습니다.
> 가장 간단한 방법은 map.js의 애니메이션이 끝난 뒤 analytics.js의 fillStats 결과로 최종 숫자만
> 덮어쓰는 것입니다.

## 5. 배포

학교 프로젝트 규모라면 무료로 배포 가능한 곳들입니다.

- **Render** (https://render.com) — Node.js 웹 서비스 무료 플랜으로 충분
- **Railway** (https://railway.app)
- **Cyclic / Fly.io** 등

배포 후에는 `public/analytics.js`의 `API_BASE` 값을 배포된 주소로 바꿔주세요.

```js
const API_BASE = "https://team-ato-api.onrender.com";
```

그리고 `server.js`의 `app.use(cors())` 부분은 보안을 위해 나중에 실제 프론트 도메인만
허용하도록 좁혀주는 걸 권장합니다.

```js
app.use(cors({ origin: "https://teamato.example.com" }));
```

## 6. 초기 데이터

`data/db.json`은 서버를 처음 실행할 때 자동으로 생성되며,
기존 프론트에 하드코딩되어 있던 다운로드 수(예: THE POST = 1,820 / 4,102 / 3,560 등)를
초깃값으로 채워둡니다. 실제 운영 중인 숫자와 다르면 `data/db.json`을 직접 열어서
숫자만 수정하면 됩니다.
