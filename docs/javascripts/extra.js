(function () {
  function showManualHome() {
    const landing = document.querySelector('.landing-page-container');
    const overview = document.querySelector('.manual-overview-container');
    if (landing) landing.classList.add('hidden');
    if (overview) overview.style.display = 'block';

    // 메인 홈 화면 진입 시 표준 UI 요소들이 숨겨져 있다면 강제로 복구
    document.body.classList.remove('landing-active');
    document.documentElement.classList.add('manual-home-mode');
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
