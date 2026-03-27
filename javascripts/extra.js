(function () {
  function showManualHome() {
    const landing = document.querySelector('.landing-page-container');
    const overview = document.querySelector('.manual-overview-container');
    if (landing) landing.classList.add('hidden');
    if (overview) overview.style.display = 'block';

    // 메인 홈 화면 진입 시 표준 UI 요소들이 숨겨져 있다면 강제로 복구
    document.body.classList.remove('landing-active');
    document.documentElement.classList.add('manual-home-mode');

    // FOUC 방지용 초기 설정 초기화
    document.documentElement.style.backgroundColor = '';
    const earlyHide = document.getElementById('early-hide');
    if (earlyHide) earlyHide.remove();
  }

  window.enterManual = function () {
    // 입장 시 세션 시간 갱신 (여기서부터 30분 카운트)
    const SESSION_KEY = 'mdrm_intro_session';
    sessionStorage.setItem(SESSION_KEY, new Date().getTime().toString());

    showManualHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handleLandingPage() {
    const landingContainer = document.querySelector('.landing-page-container');

    // 세션 스토리지 키
    const SESSION_KEY = 'mdrm_intro_session';
    const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12시간 (밀리초)

    // URL 파라미터로 인트로 강제 초기화 (?reset_intro=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset_intro')) {
      sessionStorage.removeItem(SESSION_KEY);
      // 파라미터 제거 후 리로드 (깔끔한 URL을 위해)
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      // 세션이 삭제되었으므로 아래 로직에서 인트로가 실행됨
    }

    if (landingContainer && !document.documentElement.classList.contains('manual-home-mode')) {
      const now = new Date().getTime();
      const lastSession = sessionStorage.getItem(SESSION_KEY);

      // 세션이 유효하면(12시간 이내 방문 이력 있음) 인트로 스킵
      if (lastSession && (now - parseInt(lastSession) < SESSION_DURATION)) {
        showManualHome();
        return;
      }

      // 인트로 모드 활성화 (세션 만료되었거나 첫 방문)
      document.body.classList.add('landing-active');
      const overview = document.querySelector('.manual-overview-container');
      if (overview) overview.style.display = 'none';
      landingContainer.classList.remove('hidden');

      if (!document.getElementById('starfield-canvas')) {
        initStarfield(landingContainer);
      }
      initTypingEffect();

      // 세션 갱신 (인트로를 봤으므로 현재 시간 저장)
      // 주의: 여기서 저장하면 새로고침할 때마다 갱신되므로, '입장하기' 버튼 누를 때 저장하는 것이 더 정확할 수 있으나,
      // 편의상 인트로가 로드되는 시점을 기준으로 함.
    } else {
      // 인트로가 없거나 이미 홈 모드인 경우
      document.body.classList.remove('landing-active');
    }
  }

  // 즉시 실행 시도 (FOUC 방지)
  handleLandingPage();

  document.addEventListener("DOMContentLoaded", handleLandingPage);
  if (typeof document.addEventListener === "function") {
    document.addEventListener("DOMContentChanged", handleLandingPage);
  }

  // 외부 링크 자동 새창 열기 설정 (글로벌 클릭 이벤트 위임)
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (!target || !target.href || !target.href.startsWith('http')) return;

    try {
      const url = new URL(target.href);
      if (url.host !== window.location.host) {
        target.setAttribute('target', '_blank');
        target.setAttribute('rel', 'noopener noreferrer');
      }
    } catch (err) {
      // invalid URL
    }
  }, true);

  // 초기 로드 시에도 속성 부여 (필요 시)
  function setupExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      try {
        if (new URL(link.href).host !== window.location.host) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) { }
    });
  }
  document.addEventListener("DOMContentLoaded", setupExternalLinks);
  document.addEventListener("DOMContentChanged", setupExternalLinks);
})();

// Mermaid support for Material for MkDocs (Instant Navigation compatible)
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
  });
}

// Re-run mermaid on page load/change
const observeMermaid = () => {
  if (typeof mermaid !== 'undefined') {
    mermaid.run();
  }
};

// Initial run
document.addEventListener("DOMContentLoaded", observeMermaid);

// Instant navigation support for Material theme
document.addEventListener("DOMContentChanged", observeMermaid);

// 검색창 엔터키 및 결과 페이지 로직
// 검색창 엔터키 입력 시 자동 이동 방지 (기본 동작 무시)
document.addEventListener("DOMContentLoaded", function () {
  function preventSearchEnter(e) {
    if (e.target.classList.contains("md-search__input") && e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  // 캡처링 단계에서 이벤트 가로채기
  document.body.addEventListener("keydown", preventSearchEnter, true);
});

function initStarfield(container) {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  container.insertBefore(canvas, container.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height, stars = [];

  // Updated Settings based on user request
  const STAR_COUNT = 750; // Increased by 1.5x (from 500)
  const SPEED = 8.0; // Increased by 1.5x (from 1.5)
  const TRAIL_LENGTH_FACTOR = 15; // Slightly adjusted for speed synergy

  const COLORS = [
    { r: 255, g: 255, b: 255 }, // White
    { r: 180, g: 210, b: 255 }, // Blue
    { r: 220, g: 190, b: 255 }, // Purple
    { r: 255, g: 240, b: 200 }  // Warm Gold
  ];

  function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        size: Math.random() * 1.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }

  function draw() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    stars.forEach(star => {
      star.z -= SPEED;

      if (star.z <= 0) {
        star.z = width;
        star.x = Math.random() * width - width / 2;
        star.y = Math.random() * height - height / 2;
      }

      const x = (star.x / star.z) * width + cx;
      const y = (star.y / star.z) * height + cy;

      const pz = star.z + SPEED * TRAIL_LENGTH_FACTOR;
      const px = (star.x / pz) * width + cx;
      const py = (star.y / pz) * height + cy;

      if (x > 0 && x < width && y > 0 && y < height) {
        const opacity = 1 - (star.z / width);

        // Gradient trail effect (head to tail)
        const gradient = ctx.createLinearGradient(x, y, px, py);
        gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity * 0.9})`);
        gradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size * opacity;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

function initTypingEffect() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const phrases = [
    "Enterprise Data Integration",
    "Workflow Automation Platform",
    "Strategic Infrastructure Management",
    "Next Generation MDRM Solution",
    "역시 재철이가 짱이지"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Custom Image Carousel Logic
window.moveSlide = function (n, prevBtn) {
  const container = prevBtn.closest('.custom-carousel');
  const slides = container.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;

  let currentIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.classList.contains('active')) {
      currentIndex = index;
    }
  });

  slides[currentIndex].classList.remove('active');
  let nextIndex = (currentIndex + n + slides.length) % slides.length;
  slides[nextIndex].classList.add('active');
};

// ==========================================
// 학생 맞춤형 IP 주소 동적 치환 로직
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    initDynamicIPReplacer();
    initSpotlightBackdrop();
});

// MkDocs Material Instant Navigation 지원
if (typeof document$ !== "undefined") {
    document$.subscribe(function() {
        initDynamicIPReplacer();
        initSpotlightBackdrop(); // 페이지 이동 시에도 backdrop 재등록
    });
}

// ==========================================
// 맥 스포트라이트 뒷배경(backdrop) 제어
// ==========================================
function initSpotlightBackdrop() {
    // 이미 있으면 재사용
    let backdrop = document.getElementById('spotlight-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'spotlight-backdrop';
        document.body.appendChild(backdrop);
    }

    const searchInput = document.getElementById('__search');
    if (!searchInput) return;

    // 이미 이벤트 등록된 경우 중복 방지
    if (searchInput._backdropBound) return;
    searchInput._backdropBound = true;

    searchInput.addEventListener('focus', () => {
        backdrop.classList.add('active');
    });

    searchInput.addEventListener('blur', () => {
        // blur는 약간 지연 후 처리 (결과 클릭 허용)
        setTimeout(() => {
            backdrop.classList.remove('active');
        }, 200);
    });

    // backdrop 클릭 시 검색창 포커스 해제
    backdrop.addEventListener('mousedown', () => {
        searchInput.blur();
    });
}

function initDynamicIPReplacer() {
    const STORAGE_KEY = 'mdrm_student_ip_prefix';
    const storedPrefix = localStorage.getItem(STORAGE_KEY);

    // 1. 텍스트 노드 순회 및 IP 치환 함수 (10.20.33.x 또는 10.20.xxx.x -> 10.20.{선택IP}.x)
    function replaceIPs(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            if (storedPrefix) { // 33번이어도 xxx를 치환해야 함
                const replacedText = text.replace(/10\.20\.(33|xxx)\./g, `10.20.${storedPrefix}.`);
                if (replacedText !== text) {
                    node.nodeValue = replacedText;
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 스크립트, 스타일 태그, 치환 UI 등은 예외 처리
            if (node.tagName !== "SCRIPT" && node.tagName !== "STYLE" && (!node.classList || !node.classList.contains('student-selector'))) {
                node.childNodes.forEach(replaceIPs);
            }
        }
    }

    // 초기 치환 실행
    if (storedPrefix) {
        replaceIPs(document.body);
    }

    // 전역 헤더에 선택창 인젝션
    injectGlobalUserSelector(storedPrefix);

    // 2. 학생 선택 표 필터링 (환경 안내 안내 페이지에서 본인 행만 표출)
    filterStudentTable(storedPrefix);
}

function injectGlobalUserSelector(storedPrefix) {
    const headerInner = document.querySelector('.md-header__inner');
    if (!headerInner || document.getElementById('global-user-selector')) return;
    
    // mkdocs.yml에서 자동 주입된 데이터를 사용 (overrides/main.html 참고)
    // window.MDRM_LAB이 없으면 빈 배열로 폴백
    const STUDENTS = (window.MDRM_LAB && window.MDRM_LAB.students) ? window.MDRM_LAB.students : [];

    const wrapper = document.createElement('div');
    wrapper.id = 'global-user-selector';
    wrapper.style.marginRight = '0.5rem';
    wrapper.style.marginLeft = 'auto'; // 검색창 왼쪽에 붙도록 밀어줌
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    
    const select = document.createElement('select');
    // 모던하고 예쁜 둥근 뱃지 디자인 (글래스모피즘 컨셉)
    select.style.padding = "0.3rem 2rem 0.3rem 1rem";
    select.style.borderRadius = "20px";
    select.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    select.style.background = "rgba(255, 255, 255, 0.1)";
    select.style.backdropFilter = "blur(10px)";
    select.style.color = "white";
    select.style.cursor = "pointer";
    select.style.outline = "none";
    select.style.fontSize = "0.75rem";
    select.style.fontWeight = "600";
    select.style.fontFamily = "var(--md-text-font-family, inherit)";
    select.style.appearance = "none"; // 기본 화살표 숨김
    select.style.transition = "all 0.2s ease";
    
    // 우측에 깔끔한 화살표 삽입
    select.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`;
    select.style.backgroundRepeat = "no-repeat";
    select.style.backgroundPosition = "right 0.6rem center";
    select.style.backgroundSize = "0.9em";

    // 마우스 호버 이펙트 (배경 살짝 밝게)
    select.addEventListener('mouseover', () => { select.style.background = "rgba(255, 255, 255, 0.2)"; });
    select.addEventListener('mouseout', () => { select.style.background = "rgba(255, 255, 255, 0.1)"; });
    
    const defOpt = document.createElement('option');
    defOpt.value = "";
    defOpt.textContent = "👤 최상단 교육생 선택";
    defOpt.style.color = "#333";
    defOpt.style.background = "white";
    select.appendChild(defOpt);
    
    STUDENTS.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.ipPrefix;
        opt.textContent = `👤 ${s.name} (10.20.${s.ipPrefix}.x)`;
        opt.style.color = "#333";
        opt.style.background = "white";
        if (storedPrefix == s.ipPrefix) opt.selected = true;
        select.appendChild(opt);
    });
    
    select.addEventListener('change', function() {
        if (this.value) {
            localStorage.setItem('mdrm_student_ip_prefix', this.value);
        } else {
            localStorage.removeItem('mdrm_student_ip_prefix');
        }
        window.location.reload();
    });
    
    wrapper.appendChild(select);

    const searchDiv = document.querySelector('.md-search') || document.querySelector('.md-header__source');
    if (searchDiv) {
        headerInner.insertBefore(wrapper, searchDiv);
    } else {
        headerInner.appendChild(wrapper);
    }
}

function filterStudentTable(storedPrefix) {
    const container = document.querySelector('.student-table-container');
    const placeholder = document.getElementById('student-table-placeholder');
    if (!container) return; // Not the lab page

    const table = container.querySelector('table');

    if (!storedPrefix) {
        container.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    let isFiltered = false;

    rows.forEach(row => {
        if (row.textContent.includes(`10.20.${storedPrefix}.`)) {
            row.style.display = '';
            isFiltered = true;
        } else {
            row.style.display = 'none';
        }
    });

    if (isFiltered) {
        table.style.border = '2px solid var(--md-primary-fg-color)';
        table.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        table.style.borderRadius = '4px';
    }
}
