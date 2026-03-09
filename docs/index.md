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
| **설치** | MDRM 시스템 구축 | 시스템 환경 구성 및 기본 설치 |
| **개요설명** | 운영 및 자원 관리 | 시스템/워크플로우 개요 및 관리 |
| **운영 및 활용** | 자동화 설계 및 점검 | 기동/종료 로직 및 컴포넌트 고도화 |
| **실전 실습 및 조치** | 실습 및 장애 관리 | 실전 시나리오 실습 및 트러블슈팅 |

---

## 🚀 빠른 시작

### [🧪 LAB - 실습 환경 및 네트워크 안내](lab/MDRM_LAB_환경_안내.md)
교육생별로 할당된 가상 머신(VM) 및 네트워크 IP 대역 정보를 확인합니다.

### [📘 설치 - MDRM 환경 구성](setup/MDRM_설치_학습_안내.md)
MDRM 인프라 요구사항 확인 및 컨테이너(Docker/Podman) 환경에서의 설치 과정, 그리고 관리 대상 시스템들의 Agent 배포 방안을 다룹니다.

### [🔧 개요설명 - 운영 환경 및 자원 관리](overview/MDRM_운영_학습_안내_기본.md)
대시보드와 자산을 등록하는 시스템 관리, 자동화의 기초 단위인 컴포넌트 환경 구성 및 기본 워크플로우/점검작업 스케줄링 방법을 소개합니다.

### [🔄 운영 및 활용 - 워크플로우 설계 및 고도화](operation/MDRM_운영_학습_안내_심화.md)
복잡한 비즈니스 로직을 자동화하기 위한 3-Step Logic 컴포넌트 설계법과 시나리오 기반의 고도화된 워크플로우 구성 방안을 집중적으로 학습합니다.

### [⚠️ 실전 실습 및 조치 - 트러블슈팅](practice/MDRM_운영_학습_안내_실전.md)
장애 조치 역량 확보를 위한 실전 시나리오 모의 훈련 및 각 컴포넌트별 이슈 상황에서의 심화 트러블슈팅 가이드를 제공합니다.

</div>

---

<center>
    <p style="opacity: 0.3; font-size: 0.7rem; margin-top: 4rem; padding-bottom: 2rem;">
        &copy; 2026 MDRM 교육 자료 by 서비스사업본부 1팀 김재철. All rights reserved.
    </p>
</center>
