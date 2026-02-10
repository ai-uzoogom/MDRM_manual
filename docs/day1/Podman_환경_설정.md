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
driver = "overlay"
graphroot = "{{ extra.mdrm.graph_root }}"
```

### **1.2 컨테이너 및 로그 설정**

로그 드라이버와 기본 네트워크 할당 IP 풀을 설정합니다.

```bash
# 컨테이너 설정 파일 편집
vi /etc/containers/containers.conf
```

**수정 내용:**
```toml
[network]
default_subnet = "182.18.0.0/16"
default_subnet_pools = [
  {"base" = "182.19.0.0/16", "size" = 24}
]

[engine]
[engine.log]
driver = "json-file"

[engine.log.opts]
max_size = "100m"
max_file = "5"

[containers]
label = false
```

---

## **2. 주요 설정 항목 요약**

| 항목 | 설정값 | 설명 |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;">**driver** (`storage.conf`)</span> | `overlay` | 스토리지 드라이버 방식 (가장 권장되는 overlay 타입) |
| <span style="white-space: nowrap;">**graphroot** (`storage.conf`)</span> | `{{ extra.mdrm.graph_root }}` | 컨테이너 데이터가 저장될 경로 (Docker의 `data-root` 대응) |
| <span style="white-space: nowrap;">**default_subnet** (`containers.conf`)</span> | `182.18.0.0/16` | 기본 브릿지 네트워크의 IP 대역 (Docker의 `bip` 대응) |
| <span style="white-space: nowrap;">**engine.log.driver**</span> | `json-file` | 컨테이너 로그 저장 방식 (Docker 호환성 확보) |
| <span style="white-space: nowrap;">**engine.log.opts**</span> | `max_size=100m` | 로그 파일 당 최대 용량 및 보관 개수 설정 |
| <span style="white-space: nowrap;">**label** (`containers.conf`)</span> | `false` | SELinux 라벨링 기능 비활성화 (권한 호환성 확보) |

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
