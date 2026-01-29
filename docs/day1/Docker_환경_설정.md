# ⚙️ Docker 환경 설정

Docker 설치 완료 후, 시스템 최적화 및 사내 망과의 충돌 방지를 위해 `/etc/docker/daemon.json` 파일을 사용하여 설정을 진행합니다.

---

## **1. 설정 파일 작성**

Docker의 주요 설정(데이터 저장 위치, 네트워크 대역, 로그 정책 등)을 하나의 파일로 관리합니다. 아래 내용을 참고하여 `/etc/docker/daemon.json` 파일을 생성하거나 수정해 주십시오.

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

## **2. 주요 설정 항목 설명**

| 항목 | 설정값 | 설명 |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;">**data-root**</span> | `/mdrm/engine` | Docker 이미지 및 컨테이너 데이터가 저장될 경로입니다. (최소 50GB 이상 권장) |
| <span style="white-space: nowrap;">**bip**</span> | `182.18.0.1/16` | 기본 브릿지 네트워크(`docker0`)의 IP 대역입니다. 사내 망과 충돌하지 않는 대역을 지정합니다. |
| <span style="white-space: nowrap;">**default-address-pools**</span> | `182.19.0.1/16` | 컨테이너 생성 시 할당될 네트워크 IP 풀 범위입니다. |
| <span style="white-space: nowrap;">**log-driver**</span> | `json-file` | 컨테이너 로그 저장 방식을 지정합니다. |
| <span style="white-space: nowrap;">**log-opts**</span> | `max-size`, `max-file` | 개별 로그 파일의 최대 크기(100MB)와 보관할 파일 개수(5개)를 제한합니다. |

---

## **3. 설정 적용 및 확인**

파일 작성을 완료한 후에는 서비스를 재시작해야 변경 사항이 시스템에 반영됩니다.

### **서비스 재시작 및 자동 시작 활성화**
```bash
systemctl restart docker
systemctl enable docker
```

### **적용 상태 확인**
```bash
# Docker 설정 정보 및 데이터 저장 위치 확인
docker info | grep -E "Root Dir|Logging Driver"

# 브릿지 네트워크 IP 확인
ip addr show docker0
```

!!! danger "주의사항"
    `daemon.json` 파일에 오타가 있거나 JSON 형식이 맞지 않을 경우 Docker 서비스가 시작되지 않을 수 있습니다. 수정 후에는 반드시 서비스 상태를 확인해 주십시오.

---

<a href="../MDRM_설치_및_확인/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚙️ MDRM 설치 및 확인</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
