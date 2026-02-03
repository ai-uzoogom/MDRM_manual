# ⚙️ Podman 환경 설정

!!! info "학습 안내"
    Podman 환경에서 스토리지 경로(graphroot), 로그 정책, 그리고 네트워크 대역 설정을 Docker와 호환되도록 구성하는 방법을 학습합니다.

Podman 설치 후, 시스템 최적화 및 사내 폐쇄망 환경에 맞춘 설정을 진행합니다.

---

## **1. 엔진 최적화 설정**

Podman은 단일 설정 파일(`daemon.json`)을 사용하는 Docker와 달리, 스토리지와 컨테이너 설정이 분리되어 있습니다.
제공된 설정값을 Podman 환경에 맞게 적용하려면 다음 단계를 수행합니다.

### **1.1 스토리지 설정 (data-root)**

컨테이너 이미지와 데이터가 저장될 경로를 설정합니다.

```bash
# 스토리지 설정 파일 편집
vi /etc/containers/storage.conf
```

**수정 내용:**
```toml
[storage]
# 기존 graphroot 주석 처리 후 변경
graphroot = "/mdrm/engine"
```

### **1.2 컨테이너 및 로그 설정**

로그 드라이버와 기본 네트워크 할당 IP 풀을 설정합니다.

```bash
# 컨테이너 설정 파일 편집
vi /etc/containers/containers.conf
```

**수정 내용:**
```toml
[containers]
# 로그 드라이버 (Docker의 json-file과 유사한 k8s-file 사용)
log_driver = "k8s-file"

# 로그 파일 최대 크기 (100MB = 104857600 bytes)
log_size_max = 104857600

[network]
# 컨테이너 생성 시 할당될 IP 풀 범위 (default-address-pools)
default_subnet_pools = [
  {"base" = "182.19.0.1/16", "size" = 24}
]
```

### **1.3 기본 네트워크 대역 변경 (bip)**

Podman의 기본 네트워크(`podman`) 대역을 지정된 `182.18.0.1/16`으로 설정하려면, 기존 네트워크를 삭제하고 다시 생성해야 합니다.

```bash
# 1. 기존 기본 네트워크 삭제 (초기 설치 직후 수행 권장)
podman network rm podman

# 2. 새로운 대역으로 재생성
# bip: 182.18.0.1/16 에 해당
podman network create \
  --subnet 182.18.0.0/16 \
  --gateway 182.18.0.1 \
  podman
```

---

## **2. 주요 설정 항목 요약**

| 항목 | 설정값 | 설명 |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;">**graphroot** (`storage.conf`)</span> | `/mdrm/engine` | 컨테이너 이미지 및 데이터가 저장될 경로입니다. (Docker의 `data-root` 대응) |
| <span style="white-space: nowrap;">**log_driver** (`containers.conf`)</span> | `k8s-file` | 컨테이너 로그 저장 방식을 지정합니다. (Docker의 `json-file` 대응) |
| <span style="white-space: nowrap;">**log_size_max** (`containers.conf`)</span> | `100MB` | 개별 로그 파일의 최대 크기를 제한합니다. |
| <span style="white-space: nowrap;">**default_subnet_pools** (`containers.conf`)</span> | `182.19.0.1/16` | 컨테이너 생성 시 할당될 네트워크 IP 풀 범위입니다. |
| <span style="white-space: nowrap;">**podman network** (CLI 명령어)</span> | `182.18.0.1/16` | 기본 브릿지 네트워크의 IP 대역입니다. (Docker의 `bip` 대응) |

---

## **3. Podman Compose 사용 가이드**

MDRM의 컨테이너를 실행할 때는 `podman-compose`를 사용합니다. 이는 `docker-compose.yml` 문법을 Podman 환경에 맞게 변환하여 실행해줍니다.

```bash
# MDRM 설치 디렉토리에서 실행
podman-compose up -d

# 실행 상태 확인
podman-compose ps
```

!!! tip "Podman 관리 팁"
    - Podman은 별도의 데몬이 없으므로 시스템 리소스를 적게 소모합니다.
    - `rootless` 모드로 실행할 경우 보안상으로 더 안전합니다.

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
