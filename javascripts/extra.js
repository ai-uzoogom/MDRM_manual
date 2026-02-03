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
    showManualHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handleLandingPage() {
    const landingContainer = document.querySelector('.landing-page-container');

    if (landingContainer && !document.documentElement.classList.contains('manual-home-mode')) {
      // 인트로 모드 활성화
      document.body.classList.add('landing-active');
      const overview = document.querySelector('.manual-overview-container');
      if (overview) overview.style.display = 'none';
      landingContainer.classList.remove('hidden');

      if (!document.getElementById('starfield-canvas')) {
        initStarfield(landingContainer);
      }
      initTypingEffect();
    } else {
      // 인트로가 없거나 이미 홈 모드인 경우
      document.body.classList.remove('landing-active');
    }
  }

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
