# 📦 컴포넌트 관리

## 컴포넌트 템플릿

!!! info "컴포넌트 템플릿 스크립트의 구조"
    컴포넌트 템플릿은 다음 3단계로 구성됩니다.

| 단계 | 이름 | 설명 |
|:---:|:---|:---|
| 1 | :material-check-circle: **pre-check** | 실행 전 사전 검증 |
| 2 | :material-play-circle: **execute** | 실제 작업 수행 |
| 3 | :material-check-circle-outline: **post-check** | 실행 후 검증 |

---

## 템플릿 생성 규칙

!!! warning "⚠️ 필수 규칙"
    반드시 아래 규칙을 준수해야 합니다.

### Exit Code 규칙

마지막 **exit code**가 결과를 결정합니다.

| Exit Code | 결과 |
|:---:|:---|
| `0` | ✅ 성공 |
| `그 외` | ❌ 실패 |

- 대부분의 명령어는 정상 수행 시 exit code `0` 반환

### 특수 케이스

!!! example "WAS 솔루션 예시"
    - 애플리케이션은 정상 기동되었으나 exit code `98` 반환하는 경우
    - `98`의 의미: 정상 기동되었으나 DB 접속 안됨 등

---

## 사용자 정의

사용자가 직접 정의할 수 있는 항목:

- **사용자 명령어 실행**: 단일 명령어 또는 명령어 조합
- **사용자 스크립트 정의**: 복잡한 로직이 필요한 경우

---

## 템플릿 작성 예시

### 기본 템플릿 구조

```bash
#!/bin/bash

# ====================
# Pre-check
# ====================
echo "사전 검증 시작..."
# 프로세스 상태 확인 등

# ====================
# Execute
# ====================
echo "작업 수행 중..."
# 실제 작업 수행

# ====================
# Post-check
# ====================
echo "사후 검증 시작..."
# 결과 확인

# 최종 결과 반환
exit 0
```

!!! tip "템플릿 작성 팁"
    - 각 단계별로 명확한 로그를 남기세요
    - 에러 발생 시 적절한 exit code를 반환하세요
    - 타임아웃 처리를 고려하세요

---

<a href="../MDRM_컴포넌트_실행_프로세스/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚡ 컴포넌트 실행 프로세스</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
