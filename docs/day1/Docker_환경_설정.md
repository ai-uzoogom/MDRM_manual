# ⚙️ Docker 환경 설정

!!! info "학습 안내"
    MDRM의 컨테이너 이미지 저장 경로, 네트워크 대역, 그리고 서비스 안정성을 위한 로그 정책 설정 방법을 학습합니다.

Docker 설치 완료 후, 시스템 최적화 및 사내 망과의 충돌 방지를 위해 `/etc/docker/daemon.json` 파일을 사용하여 설정을 진행합니다.

---

## **1. 엔진 최적화 설정**

Docker는 단일 설정 파일(`/etc/docker/daemon.json`)을 사용하여 이미지 저장 경로, 네트워크 대역, 로그 정책 등을 한꺼번에 관리합니다.

### **1.1 통합 설정 파일 작성**

```bash
# Docker 설정 파일 편집 (없을 경우 생성)
vi /etc/docker/daemon.json
```

**수정 내용:**
```json
{
  "data-root": "/mdrm/engine",
  "bip": "182.18.0.1/16",
  "default-address-pools": [
    {
      "base": "182.19.0.1/16",
      "size": 24
    }
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  }
}
```

---

## **2. 주요 설정 항목 요약**

| 항목 | 설정값 | 설명 |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;">**data-root**</span> | `/mdrm/engine` | Docker 이미지 및 데이터가 저장될 경로입니다. (최소 50GB 이상 권장) |
| <span style="white-space: nowrap;">**bip**</span> | `182.18.0.1/16` | 기본 브릿지 네트워크(`docker0`)의 IP 대역입니다. (사내망 충돌 방지) |
| <span style="white-space: nowrap;">**default-address-pools**</span> | `182.19.0.1/16` | 컨테이너 자동 할당용 IP 풀 대역을 지정합니다. |
| <span style="white-space: nowrap;">**log-driver**</span> | `json-file` | 컨테이너 로그 저장 방식을 지정합니다. (표준 형식) |
| <span style="white-space: nowrap;">**log-opts**</span> | `max-size=100m` | 로그 파일 당 최대 용량 및 보관 개수(5개)를 제한합니다. |

---

## **3. 설정 적용 및 확인**

파일 작성을 완료한 후에는 서비스를 재시작해야 변경 사항이 시스템에 반영됩니다.

### **3.1 서비스 재시작 및 자동 시작 활성화**
```bash
systemctl restart docker
systemctl enable docker
```

### **3.2 적용 상태 확인**
```bash
# Docker 설정 정보 및 데이터 저장 위치 확인
docker info | grep -E "Root Dir|Logging Driver"

# 브릿지 네트워크 IP 확인
ip addr show docker0
```

!!! danger "주의사항"
    `daemon.json` 파일에 오타가 있거나 JSON 형식이 맞지 않을 경우 Docker 서비스가 시작되지 않을 수 있습니다. 수정 후에는 반드시 서비스 상태를 확인해 주십시오.

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_설치_및_확인/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚙️ MDRM 설치 및 확인</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
