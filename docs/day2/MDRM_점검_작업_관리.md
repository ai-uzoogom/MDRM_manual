<div class="page-title-box">
    <h1>점검 및 작업 설정</h1>
    <p>부모(점검)와 자식(작업)의 관계를 이해하고 상세 실행 조건을 정의합니다.</p>
</div>

<div class="progress-indicator">
    <div class="progress-dot"></div>
    <div class="progress-dot"></div>
    <div class="progress-dot active"></div>
    <div class="progress-dot"></div>
    <div class="progress-dot"></div>
</div>

## 1. 점검(Inspection) 추가 및 관리
'점검'은 여러 개의 실질적인 '작업'을 담는 부모 역할을 합니다.

### 1.1 점검 설정 항목
- **기본 정보**: 점검의 명칭과 용도를 설명
- **알림 설정**: 작업 시작/종료 시 관리자에게 알림 발송 여부 및 수신자(이메일, 메신저 등) 지정

### 1.2 점검 복사 및 잠금
- **전체 복사**: 점검 복사 시 하위의 **작업 정보까지 모두 복사**되어 유사한 점검 환경을 빠르게 구축할 수 있습니다. (스케줄 제외)
- **잠금 설정**: 관리자가 `편집 잠금` 또는 `편집 & 실행 잠금`을 설정하여 승인되지 않은 변경이나 실행을 차단할 수 있습니다.

---

## 2. 작업(Task) 추가 및 관리
'작업'은 실제 시스템에서 명령을 수행하는 최소 단위입니다.

### 2.1 작업 추가 프로세스
1. **대상 시스템 선택**: 점검을 수행할 서버를 선택합니다.
2. **점검항목 추가**: `<설정 | 점검작업>`에 등록된 스크립트 기반 항목을 가져와 배치합니다.
3. **변수 입력**: 각 서버별로 필요한 변숫값(IP, Port, ID 등)을 입력합니다.
    - **시스템 변수 활용**: `[[SYSTEM_IP]]`, `[[ACCOUNT_PASSWORD]]` 등 예약어 사용 가능

### 2.2 시스템 변수 가이드
점검작업 시 유용하게 사용되는 핵심 시스템 변수입니다.

| 변수명 | 설명 | 비고 |
| :--- | :--- | :--- |
| `ACCOUNT_USERID` | 접속 계정 아이디 | 보안 계정 연동 |
| `SYSTEM_IP` | 대상 서버 IP 주소 | |
| `REMOTE_OUTPUT` | 원격 실행 결과값 | 후속 판단용 |
| `NODE_NAME` | 노드(서버) 이름 | |

### 2.3 작업 실행 상태 정의
- **미준수 (Critical)**: 반환된 문자열이 "CRITICAL"인 경우
- **준수 (OK)**: 반환된 문자열이 "OK"인 경우
- **실패**: 통신 불가 등 기술적 결함으로 명령 수행이 불가능한 상태

<a href="MDRM_점검_실행_결과.md" class="next-step-card">
    <div class="next-content">
        <div class="next-step-label">Next Step</div>
        <div class="next-step-title">실행 결과 및 이력 확인</div>
    </div>
    <div class="next-step-icon">→</div>
</a>
