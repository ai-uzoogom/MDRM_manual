# 🩺 트러블슈팅 가이드 (심화)

!!! info "학습 안내"
    운영 단계에서 발생할 수 있는 주요 통신 장애, 워크플로우 실행 오류 및 데이터베이스 연동 문제에 대한 심화 원인 분석과 조치 방법을 학습합니다.

!!! tip "원칙"
    모든 장애의 원인은 **로그(Log)**에 있습니다. MDRM 서버 로그(`mdrm.log`)와 Agent 로그(`gam_agent.log`)를 먼저 확인하십시오.

---

## **1. 통신 장애 (Network & Auth)**

### **1.1 Agent 상태가 "오프라인"인 경우**
- **증상**: MDRM 콘솔에서 서버 상태가 빨간색으로 표시됨.
- **체크리스트**:
    - [ ] Agent 서비스가 기동 중인가? (`systemctl status gam_agent`)
    - [ ] 통신 포트(20080)가 방화벽에 막혀있지 않은가? (`telnet` 또는 `nc` 테스트)
    - [ ] Agent 설정파일의 서버 IP/FQDN이 정확한가?
- **조치**: 통신 결합도 확인 후 Agent 재시작.

### **1.2 417 Expectation Failed 오류**
- **원인**: MDRM 서버와 Agent 간의 **통신 토큰(Token)** 불일치.
- **조치**:
    1.  MDRM 콘솔에서 해당 시스템의 토큰 초기화 버튼 클릭.
    2.  Agent 설정파일의 토큰 정보를 갱신하고 재시작.

---

## **2. 워크플로우 실행 장애 (Logic & OS)**

### **2.1 좀비 프로세스로 인한 기동 실패**
- **상황**: 서비스 종료 워크플로우를 돌렸으나 프로세스가 완벽히 죽지 않아 기동 시 "Address already in use" 발생.
- **방지법**: 컴포넌트 설계 시 `Kill Process` 단계를 포함하거나, `Post-check` 로직에서 포트 사용 여부를 반드시 확인하십시오.

### **2.2 환경변수 미인식**
- **상황**: 수동으로 실행하면 잘 되는데 MDRM으로 실행하면 "Command not found" 발생.
- **원인**: Agent는 비대화형 쉘(Non-interactive shell)을 사용하므로 `.bash_profile` 등을 완벽히 읽지 못할 수 있음.
- **해결책**: 스크립트 상단에 `source ~/.bash_profile` 또는 `export PATH=...`와 같이 필요한 환경변수를 명시적으로 선언하십시오.

---

## **3. 데이터베이스 연동 장애**

- **SQL 실행 오류**: JDBC 드라이버 누락 또는 계정 권한 부족.
- **타임아웃**: 대용량 쿼리 수행 시 컴포넌트 타임아웃 설정값이 너무 짧은 경우.

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_교육_마무리/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🏁 교육 마무리 및 성과 요약</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
