<script>
  if (!sessionStorage.getItem('mdrm_intro_session') || new URLSearchParams(window.location.search).has('reset_intro')) {
    document.documentElement.style.backgroundColor = '#020617';
    document.write('<style id="early-hide">[data-md-component="header"], [data-md-component="tabs"], .md-sidebar, .md-sidebar--secondary, .md-footer { display: none !important; } .md-main, .md-content, .md-content__inner, .md-typeset { background: transparent !important; box-shadow: none !important; margin: 0 !important; padding: 0 !important; animation: none !important; transform: none !important; max-width: none !important; }</style>');
  }
</script>

<div class="landing-page-container">
    <h1 class="landing-title">MDRM</h1>
    
    <div class="typing-container">
        <span id="typing-text" class="landing-subtitle"></span>
        <span class="cursor">|</span>
    </div>
    
    <button onclick="enterManual()" class="enter-button solo-btn">
        <span>GET STARTED</span>
        <span class="icon">→</span>
    </button>
</div>

<!-- 교육 요약 본문 (인트로 이후 노출) -->
<div class="manual-overview-container" markdown="block">

# 🏠 MDRM 교육 매뉴얼 홈

!!! info "시스템 설치부터 운영까지 완벽 가이드"
    이 문서는 MDRM 시스템의 설치, 구성, 운영에 필요한 모든 내용을 담고 있습니다.

## 📚 교육 과정 개요

| 일차 | 주제 | 내용 |
|:---:|:---|:---|
| **DAY 1** | MDRM 설치 | 시스템 환경 구성 및 기본 설치 |
| **DAY 2** | 운영 및 자원 관리 | Agent 설치 및 시스템/워크플로우 관리 |
| **DAY 3** | 워크플로우 설계 | 기동/종료 로직 및 컴포넌트 고도화 |
| **DAY 4** | 실습 및 장애 조치 | 실전 시나리오 실습 및 트러블슈팅 |

---

## 🚀 빠른 시작

### [🧪 LAB - 실습 환경 및 네트워크 안내](lab/MDRM_LAB_환경_안내.md)
교육생별로 할당된 가상 머신(VM) 및 네트워크 IP 대역 정보를 확인합니다.

### [📘 DAY 1 - MDRM 설치 및 환경 구성](day1/MDRM_DAY1_학습_안내.md)
인프라 사양 확인부터 Docker/Podman 설치, 그리고 MDRM 엔진 구동까지의 과정을 다룹니다.

### [🔧 DAY 2 - 운영 환경 및 자원 관리](day2/MDRM_DAY2_학습_안내.md)
Agent 설치부터 시스템 그룹화, 워크플로우 기초 구성을 학습하여 운영 체계를 구축합니다.

### [🔄 DAY 3 - 워크플로우 설계 및 고도화](day3/MDRM_DAY3_학습_안내.md)
3단계 로직 기반의 컴포넌트 설계와 계층적 워크플로우 구성을 통해 고도화된 자동화를 구현합니다.

### [⚠️ DAY 4 - 실전 실습 및 트러블슈팅](day4/MDRM_DAY4_학습_안내.md)
실제 재해 선포 시나리오를 실습하고, 현장에서 발생하는 다양한 장애 상황에 대한 조치 능력을 배양합니다.

</div>

---

<center>
    <p style="opacity: 0.3; font-size: 0.7rem; margin-top: 4rem; padding-bottom: 2rem;">
        &copy; 2026 MDRM 교육 자료 by 서비스사업본부 1팀 김재철. All rights reserved.
    </p>
</center>
