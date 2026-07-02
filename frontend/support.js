/* ══════════════════════════════════
   TEAM 아토 — support.js
══════════════════════════════════ */

/* ════════════════════════════════════════════
   FAQ 데이터 — 새 QnA는 이 배열에만 추가하면 됩니다.

   카테고리(id)를 새로 만들고 싶으면 CATEGORIES 배열에도
   { id, icon, name } 형태로 한 줄 추가하세요.

   각 QnA 항목:
   {
     cat:      카테고리 id (CATEGORIES 의 id 와 일치해야 함)
     q:        질문
     a:        답변 (HTML 가능 — <br/>, <strong>, <code>, <a> 등 사용 가능)
     keywords: 검색에 쓰일 키워드 (공백으로 구분, 자유 입력)
     tip:      (선택) 노란 박스로 강조할 팁. 없으면 생략 가능
   }
════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'install', icon: '📦', name: '설치 & 실행' },
  { id: 'bug',     icon: '🐛', name: '버그 & 오류' },
  { id: 'policy',  icon: '📋', name: '이용 규정' },
  { id: 'multi',   icon: '🎮', name: '멀티플레이' },
  { id: 'bucket',  icon: '🖥️', name: '버킷 서버 제작' },
  { id: 'donate',  icon: '💎', name: '후원 & Patreon' },
  { id: 'etc',     icon: '💬', name: '기타 문의' },
  // 새 카테고리 예시:
  // { id: 'newcat', icon: '✨', name: '새 카테고리' },
];

const FAQ_DATA = [

  /* ── 설치 & 실행 ── */
  {
    cat: 'install',
    q: '맵은 어떻게 설치하나요?',
    keywords: '설치 방법 minecraft saves 폴더',
    a: `다운로드한 압축 파일을 해제한 뒤, 생성된 폴더를
        <code>%appdata%\\.minecraft\\saves</code> 경로에 넣어주세요.
        그 후 마인크래프트를 실행해 싱글플레이 → 세계 선택에서 확인하실 수 있습니다.`,
    tip: '💡 폴더가 아닌 파일(.zip)을 그대로 넣으면 맵이 인식되지 않습니다.',
  },
  {
    cat: 'install',
    q: '어떤 마인크래프트 버전을 사용해야 하나요?',
    keywords: '버전 java edition 1.12 1.20',
    a: `맵마다 권장 버전이 다릅니다. 대부분 <strong>Java Edition 1.12 ~ 1.20</strong> 범위 내에서 동작하며,
        각 맵 다운로드 페이지의 상세 정보에서 정확한 버전을 확인해 주세요.
        잘못된 버전으로 실행 시 커맨드 블록 오작동이나 텍스처 깨짐 현상이 발생할 수 있습니다.`,
  },
  {
    cat: 'install',
    q: '맵을 선택하면 바로 튕기거나 로딩이 안 됩니다.',
    keywords: '실행 안됨 오류 로딩 세계',
    a: `아래 항목을 순서대로 확인해 주세요.<br/><br/>
        1. 권장 버전과 실제 버전이 일치하는지 확인<br/>
        2. <code>saves</code> 폴더 내 맵 폴더가 이중으로 감싸져 있지 않은지 확인<br/>
        3. Java 최신 버전으로 업데이트<br/>
        4. Optifine 등 모드가 충돌하는지 바닐라 버전으로 재시도<br/><br/>
        그래도 해결되지 않으면 디스코드로 문의 주세요.`,
  },
  {
    cat: 'install',
    q: '리소스팩이나 텍스처팩이 필요한가요?',
    keywords: '리소스팩 텍스처 설치',
    a: `일부 맵(LAIN, 귀담경찰 시리즈 등)은 전용 리소스팩이 포함되어 있습니다.
        맵 폴더 내 <code>resources.zip</code> 또는 <code>리소스팩</code> 폴더가 있다면
        마인크래프트의 리소스팩 설정에서 활성화해 주세요.
        활성화하지 않으면 일부 텍스처와 폰트가 정상 표시되지 않습니다.`,
  },
  {
    cat: 'install',
    q: 'Mac에서는 어떤 경로에 설치하나요?',
    keywords: '맥 mac osx 설치 경로',
    a: `Mac에서는 <code>~/Library/Application Support/minecraft/saves</code> 경로에 넣어주세요.
        Finder에서 <strong>이동 → 폴더로 이동</strong>을 클릭하고 위 경로를 붙여넣으면 빠르게 접근할 수 있습니다.`,
  },

  /* ── 버그 & 오류 ── */
  {
    cat: 'bug',
    q: '버그를 발견했어요. 어떻게 신고하나요?',
    keywords: '버그 신고 제보 방법',
    a: `디스코드 서버의 <strong>#버그제보</strong> 채널에 아래 정보를 포함해서 올려주세요.<br/><br/>
        • 맵 이름 및 버전<br/>
        • 마인크래프트 버전<br/>
        • 증상 설명 (어느 구간, 어떤 상황)<br/>
        • 가능하다면 스크린샷 또는 영상<br/><br/>
        신고해주신 내용은 최대한 빠르게 검토해 패치에 반영하겠습니다.
        <a href="https://discord.gg/2zyZtytDbK" target="_blank" class="sp-a-link">→ 디스코드 바로가기</a>`,
  },
  {
    cat: 'bug',
    q: '특정 구간에서 진행이 막히거나 문이 안 열려요.',
    keywords: '커맨드 블록 오작동 문이 안열려 진행 불가',
    a: `커맨드 블록 관련 버그일 수 있습니다. 다음을 시도해 보세요.<br/><br/>
        1. 마인크래프트를 완전히 종료 후 재실행<br/>
        2. 싱글플레이로 재접속<br/>
        3. 설정에서 치트 허용이 되어 있는지 확인 (일부 맵은 필수)<br/><br/>
        그래도 해결되지 않으면 해당 구간 스크린샷과 함께 디스코드로 문의해 주세요.`,
  },
  {
    cat: 'bug',
    q: '텍스처가 깨지거나 이상하게 표시돼요.',
    keywords: '텍스처 깨짐 표시 안됨 리소스팩',
    a: `리소스팩이 활성화되어 있지 않은 경우가 대부분입니다.
        맵과 함께 제공된 리소스팩을 활성화했는지 확인해 주세요.
        또한 다른 리소스팩이 충돌할 수 있으므로, 전용 리소스팩만 단독으로 활성화한 뒤 테스트해 보세요.`,
  },
  {
    cat: 'bug',
    q: 'BGM이나 사운드가 재생되지 않아요.',
    keywords: '소리 음악 bgm 재생 안됨',
    a: `마인크래프트 설정 → 음악 및 소리에서 볼륨이 꺼져 있지 않은지 확인해 주세요.
        특히 <strong>녹음/음악</strong> 항목이 0으로 설정되어 있는 경우 BGM이 재생되지 않습니다.
        일부 맵은 리소스팩 내 커스텀 사운드를 사용하므로 리소스팩 활성화 여부도 함께 확인해 주세요.`,
  },

  /* ── 이용 규정 ── */
  {
    cat: 'policy',
    q: '방송이나 유튜브 영상에 사용해도 되나요?',
    keywords: '방송 유튜브 영상 허용 저작권',
    a: `개인 방송 및 비상업적 유튜브 영상은 <strong>자유롭게 허용</strong>됩니다.
        영상 설명란에 TEAM 아토 공식 사이트 또는 디스코드 링크를 남겨주시면 감사하겠습니다.<br/><br/>
        단, 아래 행위는 금지됩니다.<br/>
        • 맵 파일의 무단 재배포<br/>
        • 맵을 활용한 상업적 목적의 콘텐츠 판매<br/>
        • 원작자 표기 없이 맵을 자신의 창작물로 주장하는 행위`,
  },
  {
    cat: 'policy',
    q: '맵을 수정하거나 재배포할 수 있나요?',
    keywords: '재배포 수정 편집 배포 금지',
    a: `맵의 무단 수정 및 재배포는 금지되어 있습니다.
        개인 플레이 목적의 가벼운 수정(편의성 등)은 괜찮지만,
        수정된 버전을 공개적으로 배포하거나 공유하는 것은 허용되지 않습니다.
        콜라보 또는 특별한 목적이 있다면 디스코드로 먼저 문의해 주세요.`,
  },
  {
    cat: 'policy',
    q: '팬아트나 2차 창작은 허용되나요?',
    keywords: '팬아트 2차창작 허용',
    a: `팬아트 및 비상업적 2차 창작은 환영합니다! 😊<br/>
        디스코드의 <strong>#팬아트</strong> 채널에 자유롭게 공유해 주세요.
        상업적 목적의 2차 창작(굿즈 판매 등)은 사전에 별도 문의가 필요합니다.`,
  },

  /* ── 멀티플레이 ── */
  {
    cat: 'multi',
    q: '친구와 함께 플레이할 수 있나요?',
    keywords: '멀티 같이 하기 서버 친구',
    a: `맵마다 권장 플레이 인원이 다릅니다.<br/><br/>
        • <strong>THE CO-OP</strong> — 2인 협동 전용<br/>
        • <strong>MISSING COLOR, LAIN, COLOR JUMP</strong> — 1인 권장 (멀티 가능하나 밸런스 미지원)<br/>
        • <strong>귀담경찰 시리즈</strong> — 1~2인 권장<br/><br/>
        멀티플레이는 호스트가 LAN 개방 또는 Aternos 같은 무료 서버를 통해 진행하는 것을 추천합니다.`,
  },
  {
    cat: 'multi',
    q: 'LAN 개방으로 같이 하려면 어떻게 하나요?',
    keywords: 'lan 개방 로컬 네트워크 서버',
    a: `호스트(맵을 가진 플레이어)가 싱글플레이로 맵을 열고,
        <strong>ESC → 랜(LAN)에 공개</strong>를 클릭하면 같은 와이파이에 연결된 친구가 멀티플레이어 탭에서 접속할 수 있습니다.
        치트 허용 여부는 맵에 따라 필요할 수 있으니 각 맵 설명을 확인해 주세요.`,
  },
  {
    cat: 'multi',
    q: '멀티플레이 중 커맨드가 오작동해요.',
    keywords: '커맨드 오작동 멀티 동기화',
    a: `1인 권장 맵을 멀티로 플레이할 경우 커맨드 블록의 트리거가 중복으로 작동하는 문제가 발생할 수 있습니다.
        가급적 권장 인원에 맞게 플레이해 주시고, 버그가 재현된다면 디스코드로 제보해 주세요.`,
  },

  /* ── 후원 & Patreon ── */
  {
    cat: 'donate',
    q: '후원은 어떻게 하나요?',
    keywords: '후원 방법 patreon 결제',
    a: `<a href="https://www.patreon.com/c/teamato" target="_blank" class="sp-a-link">Patreon 페이지</a>에서 원하는 티어를 선택해 후원하실 수 있습니다.
        후원금은 전액 맵 제작 및 서버 운영에 사용됩니다.
        Patreon 계정이 없다면 간단히 회원가입 후 이용할 수 있습니다.`,
  },
  {
    cat: 'donate',
    q: '후원하면 어떤 혜택이 있나요?',
    keywords: '후원 혜택 patreon 특전 디스코드',
    a: `후원자 혜택은 다음과 같습니다.<br/><br/>
        ✓ 신작 맵 우선 체험<br/>
        ✓ 베타 테스트 참여 우선권<br/>
        ✓ 디스코드 후원자 전용 채널 접근<br/>
        ✓ 제작 비하인드 공유<br/><br/>
        혜택은 추후 업데이트될 수 있습니다.`,
  },
  {
    cat: 'donate',
    q: '후원을 취소하거나 환불할 수 있나요?',
    keywords: '후원 취소 환불 patreon',
    a: `후원 취소는 Patreon 계정 설정에서 언제든지 자유롭게 하실 수 있습니다.
        환불과 관련된 정책은 Patreon 공식 환불 정책을 따르며, 문제가 있을 경우 디스코드로 문의해 주세요.`,
  },

  /* ── 기타 문의 ── */
  {
    cat: 'etc',
    q: '팀원으로 합류하고 싶어요.',
    keywords: '팀 합류 지원 팀원',
    a: `TEAM 아토는 현재 소규모로 운영 중이며, 필요 시 공개 모집을 진행합니다.
        모집 공고는 디스코드 서버에서 가장 먼저 확인하실 수 있습니다.
        <a href="https://discord.gg/2zyZtytDbK" target="_blank" class="sp-a-link">→ 디스코드 참여하기</a>`,
  },
  {
    cat: 'etc',
    q: '다음 맵은 언제 출시되나요?',
    keywords: '다음 맵 신작 출시 예정',
    a: `신작 출시 일정은 공식적으로 공개하지 않습니다.
        제작 현황이나 비하인드는 디스코드 서버 및 Patreon을 통해 먼저 공개됩니다.
        알림을 받고 싶으시다면 디스코드 서버에 참여해 주세요!`,
  },
  {
    cat: 'etc',
    q: '직접 문의하고 싶어요.',
    keywords: '연락처 이메일 문의 직접',
    a: `현재 가장 빠른 문의 방법은 <strong>디스코드</strong>입니다.
        공식 이메일 문의는 준비 중이며, 디스코드의 <strong>#문의</strong> 채널을 이용해 주세요.
        <a href="https://discord.gg/2zyZtytDbK" target="_blank" class="sp-a-link">→ 디스코드 바로가기</a>`,
  },

  /* ── 버킷 서버 제작 ── */
  {
    cat: 'bucket',
    q: '버킷 서버란 무엇인가요?',
    keywords: '버킷 서버 bukkit spigot 멀티 귀담경찰 the-coop',
    a: `버킷(Bukkit / Spigot) 서버는 마인크래프트 Java Edition 전용 멀티플레이 서버입니다.<br/><br/>
귀담경찰 시리즈와 THE CO-OP처럼 커맨드 블록 기반으로 동작하는 맵은 LAN 개방만으로는 멀티 플레이가 불안정할 수 있기 때문에,
전용 버킷 서버를 통해 안정적으로 플레이하는 것을 권장합니다.`,
  },
  {
    cat: 'bucket',
    q: '버킷 서버 파일은 어디서 받나요?',
    keywords: '서버 파일 다운로드 버킷 bukkit spigot jar',
    a: `맵 다운로드 ZIP 파일 안에 서버 파일이 포함되어 있습니다.<br/><br/>
ZIP 압축을 해제하면 <code>server/</code> 폴더 안에 <code>start.bat</code> 파일과 서버 JAR, 맵 파일이 함께 들어 있습니다.
별도로 서버 소프트웨어를 다운받을 필요 없이 포함된 파일 그대로 사용하시면 됩니다.`,
    tip: '💡 압축 해제 경로에 한글이나 특수문자가 포함되면 서버가 실행되지 않을 수 있습니다. 영문 경로에 압축을 해제하세요.',
  },
  {
    cat: 'bucket',
    q: '서버를 어떻게 실행하나요?',
    keywords: '서버 실행 start.bat 배치 파일 java',
    a: `<strong>1단계</strong> — 맵 ZIP 파일을 영문 경로에 압축 해제합니다. (예: <code>C:\\TeamAto\\</code>)<br/><br/>
<strong>2단계</strong> — 압축 해제한 폴더 안의 <code>start.bat</code>을 더블클릭해 서버를 실행합니다.<br/><br/>
<strong>3단계</strong> — 검은 창(서버 콘솔)이 열리고 "Done" 메시지가 나타나면 서버 준비 완료입니다.<br/><br/>
<strong>4단계</strong> — 마인크래프트를 열고 <strong>멀티플레이 → 서버 추가</strong>에서 주소 <code>localhost</code>를 입력해 접속합니다.<br/><br/>
같은 와이파이의 친구는 호스트의 로컬 IP(예: <code>192.168.0.X</code>)로 접속하면 됩니다.`,
    tip: '💡 Java가 설치되어 있어야 서버가 실행됩니다. Java 21 이상(최신 버전)을 권장합니다.',
  },
  {
    cat: 'bucket',
    q: '서버 실행 시 "Java를 찾을 수 없습니다" 오류가 나요.',
    keywords: 'java 오류 실행 안됨 jdk jre',
    a: `Java가 설치되어 있지 않거나 환경 변수에 등록되지 않은 경우입니다.<br/><br/>
<a href="https://adoptium.net" target="_blank" class="sp-a-link">Adoptium (Eclipse Temurin)</a>에서 Java 21을 다운로드해 설치한 뒤 다시 시도해 주세요.<br/><br/>
설치 중 <strong>"Add to PATH"</strong> 옵션을 반드시 체크해주세요.`,
  },
  {
    cat: 'bucket',
    q: '외부(원격) 친구도 접속할 수 있나요?',
    keywords: '외부 접속 포트 포워딩 공유기 원격 친구',
    a: `같은 와이파이가 아닌 원격 친구가 접속하려면 <strong>포트 포워딩</strong>이 필요합니다.<br/><br/>
공유기 관리 페이지에서 TCP <strong>25565</strong> 포트를 호스트 PC의 내부 IP로 포워딩하면 됩니다.<br/><br/>
포트 포워딩이 어렵다면 <strong>Radmin VPN</strong> 또는 <strong>Hamachi</strong> 같은 가상 LAN 툴을 이용하거나,
<a href="https://aternos.org" target="_blank" class="sp-a-link">Aternos</a> 같은 무료 서버 호스팅 서비스를 이용하는 것도 방법입니다.`,
    tip: '💡 포트 포워딩 방법은 공유기 제조사(ipTime, TP-Link 등)마다 다릅니다. 공유기 모델명 + "포트포워딩"으로 검색해보세요.',
  },
  {
    cat: 'bucket',
    q: '서버에서 커맨드가 작동하지 않아요.',
    keywords: '커맨드 명령어 오류 op 권한 서버',
    a: `서버에서 커맨드 블록이 동작하려면 <code>server.properties</code> 파일에서
<code>enable-command-block=true</code>로 설정되어 있어야 합니다.<br/><br/>
포함된 서버 파일에는 이미 설정이 되어 있지만, 직접 서버를 구성하는 경우 확인이 필요합니다.<br/><br/>
또한 접속한 플레이어에게 OP 권한이 필요한 경우, 서버 콘솔에서 <code>op 플레이어명</code>을 입력해 권한을 부여하세요.`,
  },

  // ↓↓↓ 새 QnA 추가 예시 (복사해서 cat / q / keywords / a 만 바꾸면 됩니다) ↓↓↓
  // {
  //   cat: 'etc',
  //   q: '새로운 질문 제목',
  //   keywords: '검색용 키워드 여러개 공백으로',
  //   a: `답변 내용을 여기 적습니다. <strong>강조</strong>나 <br/> 줄바꿈, <code>코드</code> 사용 가능.`,
  //   tip: '💡 선택적으로 노란 팁 박스를 넣을 수 있습니다.',
  // },

];

/* ════════ FAQ 자동 렌더링 ════════ */
(function () {
  const catGrid    = document.getElementById('catGrid');
  const tocList    = document.getElementById('tocList');
  const faqGroups  = document.getElementById('faqGroups');
  if (!catGrid || !faqGroups) return;

  // 카테고리별 개수 계산
  const countByCat = {};
  FAQ_DATA.forEach(item => {
    countByCat[item.cat] = (countByCat[item.cat] || 0) + 1;
  });

  // 실제로 항목이 있는 카테고리만 표시
  const activeCats = CATEGORIES.filter(c => countByCat[c.id] > 0);

  // 1. 카테고리 카드 렌더링
  catGrid.innerHTML = activeCats.map(c => `
    <button class="sp-cat" data-cat="${c.id}">
      <span class="sp-cat-icon">${c.icon}</span>
      <span class="sp-cat-name">${c.name}</span>
      <span class="sp-cat-count">${countByCat[c.id]}개 항목</span>
    </button>
  `).join('');

  // 2. 사이드 목차 렌더링
  tocList.innerHTML = activeCats.map((c, i) => `
    <li><a href="#cat-${c.id}" class="sp-toc-link${i === 0 ? ' active' : ''}">${c.name}</a></li>
  `).join('');

  // 3. FAQ 그룹 렌더링
  faqGroups.innerHTML = activeCats.map(c => {
    const items = FAQ_DATA.filter(item => item.cat === c.id);
    const itemsHtml = items.map(item => `
      <div class="sp-item" data-keywords="${(item.keywords || '').toLowerCase()}">
        <button class="sp-q">
          ${item.q}
          <span class="sp-arr">›</span>
        </button>
        <div class="sp-a">
          <div class="sp-a-inner">
            ${item.a}
            ${item.tip ? `<div class="sp-tip">${item.tip}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="sp-group" id="cat-${c.id}" data-cat="${c.id}">
        <h2 class="sp-group-title">
          <span class="sp-group-icon">${c.icon}</span> ${c.name}
        </h2>
        <div class="sp-items">${itemsHtml}</div>
      </div>
    `;
  }).join('');

  // 4. 카테고리 카드 클릭 → 스크롤 (다른 IIFE 에서 .sp-cat 에 이벤트 거니 DOM 생성만 여기서 끝)
})();


/* ════════ 헤더 파티클 캔버스 ════════ */
(function () {
  const canvas = document.getElementById('spCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  window.addEventListener('resize', resize);

  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#dbeafe'];
  const dots = Array.from({ length: 45 }, () => mkDot());

  function mkDot(fromBottom = false) {
    const size = Math.random() * 7 + 3;
    return {
      x:     Math.random() * canvas.width,
      y:     fromBottom ? canvas.height + 12 : Math.random() * canvas.height,
      size,
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.004,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -(Math.random() * 0.3 + 0.08),
      life:  fromBottom ? 0 : Math.random() * 0.6,
      maxAlpha: Math.random() * 0.35 + 0.08,
    };
  }

  (function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((d, i) => {
      d.x    += d.vx;
      d.y    += d.vy;
      d.rot  += d.rotV;
      d.life += 0.0018;

      // 부드러운 페이드인 → 유지 → 페이드아웃
      let alpha;
      if (d.life < 0.15)       alpha = (d.life / 0.15) * d.maxAlpha;
      else if (d.life < 0.75)  alpha = d.maxAlpha;
      else                     alpha = ((1 - d.life) / 0.25) * d.maxAlpha;

      const h = d.size / 2;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle   = d.color;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      ctx.fillRect(-h, -h, d.size, d.size);
      ctx.restore();

      if (d.life >= 1 || d.y < -12) dots[i] = mkDot(true);
    });
    requestAnimationFrame(frame);
  })();
})();


/* ════════ 검색 기능 ════════ */
(function () {
  const input      = document.getElementById('searchInput');
  const clearBtn   = document.getElementById('searchClear');
  const sugBox     = document.getElementById('suggestions');
  const faqBody    = document.getElementById('faqBody');
  const srResults  = document.getElementById('searchResults');

  // 모든 FAQ 아이템 수집
  const allItems = [...document.querySelectorAll('.sp-item')];

  // 검색 제안 데이터 (자주 쓰는 키워드)
  const SUGGESTIONS = [
    { icon: '📦', text: '맵 설치 방법', cat: '설치 & 실행' },
    { icon: '🎮', text: '어떤 버전으로 플레이하나요', cat: '설치 & 실행' },
    { icon: '🐛', text: '버그 신고하기', cat: '버그 & 오류' },
    { icon: '📺', text: '방송에 사용해도 되나요', cat: '이용 규정' },
    { icon: '🤝', text: '멀티플레이 방법', cat: '멀티플레이' },
    { icon: '💎', text: 'Patreon 후원 방법', cat: '후원' },
    { icon: '📋', text: '재배포 및 수정 가능 여부', cat: '이용 규정' },
    { icon: '💬', text: '팀원 합류 문의', cat: '기타 문의' },
  ];

  function showSuggestions(q) {
    const filtered = SUGGESTIONS.filter(s =>
      s.text.includes(q) || s.cat.includes(q)
    ).slice(0, 5);

    if (!filtered.length || !q) { sugBox.classList.remove('show'); return; }

    sugBox.innerHTML = filtered.map(s => `
      <div class="sp-sug-item" data-q="${s.text}">
        <span class="sp-sug-icon">${s.icon}</span>
        <span>${highlight(s.text, q)}</span>
        <span class="sp-sug-cat">${s.cat}</span>
      </div>
    `).join('');
    sugBox.classList.add('show');

    sugBox.querySelectorAll('.sp-sug-item').forEach(el => {
      el.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = el.dataset.q;
        runSearch(el.dataset.q);
        sugBox.classList.remove('show');
      });
    });
  }

  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function runSearch(q) {
    const trimmed = q.trim().toLowerCase();
    clearBtn.classList.toggle('show', !!trimmed);

    if (!trimmed) {
      // 검색 초기화
      srResults.classList.remove('show');
      srResults.innerHTML = '';
      allItems.forEach(it => {
        it.classList.remove('sp-highlight', 'sp-dim');
      });
      document.querySelectorAll('.sp-group').forEach(g => g.style.display = '');
      return;
    }

    // 매칭 아이템 찾기
    const matched = allItems.filter(it => {
      const kw  = (it.dataset.keywords || '').toLowerCase();
      const q_  = it.querySelector('.sp-q')?.textContent.toLowerCase() || '';
      const a_  = it.querySelector('.sp-a-inner')?.textContent.toLowerCase() || '';
      return kw.includes(trimmed) || q_.includes(trimmed) || a_.includes(trimmed);
    });

    // 검색 결과 헤더
    srResults.innerHTML = `
      <p class="sp-search-results-title">
        "<strong>${q}</strong>" 검색 결과 — ${matched.length}개
      </p>
    `;
    srResults.classList.add('show');

    // 아이템 표시/숨김
    allItems.forEach(it => {
      if (matched.includes(it)) {
        it.classList.add('sp-highlight');
        it.classList.remove('sp-dim');
        it.closest('.sp-group').style.display = '';
      } else {
        it.classList.remove('sp-highlight');
        it.classList.add('sp-dim');
      }
    });

    // 매칭 없는 그룹 숨기기
    document.querySelectorAll('.sp-group').forEach(g => {
      const hasMatch = [...g.querySelectorAll('.sp-item')].some(it => matched.includes(it));
      g.style.display = hasMatch ? '' : 'none';
    });

    // 첫 번째 매칭 항목 열기
    if (matched.length) {
      matched[0].classList.add('open');
    }
  }

  input.addEventListener('input', e => {
    showSuggestions(e.target.value);
    runSearch(e.target.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      sugBox.classList.remove('show');
      input.blur();
    }
    if (e.key === 'Enter') {
      sugBox.classList.remove('show');
      runSearch(input.value);
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.sp-search-wrap')) {
      sugBox.classList.remove('show');
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    runSearch('');
    input.focus();
  });

  // mark 스타일
  const style = document.createElement('style');
  style.textContent = 'mark { background:#dbeafe; color:var(--blue); border-radius:2px; padding:0 2px; }';
  document.head.appendChild(style);
})();


/* ════════ 카테고리 카드 클릭 → 스크롤 ════════ */
document.querySelectorAll('.sp-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    const target = document.getElementById('cat-' + cat);
    if (!target) return;

    // 활성 표시
    document.querySelectorAll('.sp-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 스크롤
    const y = target.getBoundingClientRect().top + window.scrollY
            - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80') - 24;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // 첫 번째 항목 자동으로 열기
    const first = target.querySelector('.sp-item');
    if (first && !first.classList.contains('open')) first.classList.add('open');
  });
});


/* ════════ FAQ 아코디언 ════════ */
document.querySelectorAll('.sp-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.sp-item');
    const isOpen = item.classList.contains('open');
    // 같은 그룹 내 다른 항목 닫기
    const group = item.closest('.sp-items');
    group.querySelectorAll('.sp-item.open').forEach(i => {
      if (i !== item) i.classList.remove('open');
    });
    item.classList.toggle('open', !isOpen);
  });
});


/* ════════ 사이드 TOC 스크롤 스파이 ════════ */
(function () {
  const links  = document.querySelectorAll('.sp-toc-link');
  const groups = document.querySelectorAll('.sp-group');
  if (!links.length || !groups.length) return;

  const navH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h') || '80') + 32;

  function onScroll() {
    let current = '';
    groups.forEach(g => {
      if (g.getBoundingClientRect().top <= navH) current = g.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ════════ 카드 스크롤 reveal ════════ */
(function () {
  const els = document.querySelectorAll('.sp-cat, .sp-group');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('sp-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  // 초기 스타일
  const style = document.createElement('style');
  style.textContent = `
    .sp-cat, .sp-group {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .sp-cat.sp-visible, .sp-group.sp-visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(style);

  els.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 55 + 'ms';
    obs.observe(el);
  });
})();