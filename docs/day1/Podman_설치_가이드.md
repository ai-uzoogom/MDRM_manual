# 🦭 Podman 설치 가이드

이 가이드는 Rocky Linux, RHEL 등 최신 RedHat 계열 OS에서 Docker의 대안으로 **Podman**을 설치하고, MDRM 구동에 필요한 기본 환경을 구성하는 방법을 안내합니다.

!!! tip "환경에 따른 선택"
    만약 전통적인 **Docker** 엔진을 설치하고자 한다면, [Docker 설치 가이드](Docker_설치_가이드.md)를 참조하십시오.

---

## **1. 기존 Docker 제거 (충돌 방지)**

Podman 설치 시 `podman-docker` 패키지(Docker 명령어 호환)를 함께 설치하는데, 이는 기존 Docker와 충돌할 수 있습니다. 이미 Docker가 설치되어 있다면 먼저 제거해 주십시오.

```bash
# Docker 서비스 중지 및 제거
systemctl stop docker
systemctl disable docker
yum remove -y docker \
              docker-client \
              docker-client-latest \
              docker-common \
              docker-latest \
              docker-latest-logrotate \
              docker-logrotate \
              docker-engine
```

---

## **2. Podman 및 관련 도구 설치**

Rocky Linux/RHEL 8/9 시스템에서는 `dnf`(또는 `yum`)를 통해 의존성 문제없이 간단하게 설치할 수 있습니다. (Python 등 필요 라이브러리가 자동 설치됩니다)

```bash
# Podman 및 주요 도구 설치
yum install -y podman podman-docker podman-plugins podman-compose
```

!!! info "주요 패키지 설명"
    - **podman**: 컨테이너 런타임 엔진
    - **podman-docker**: `docker` 명령어를 `podman`으로 매핑해주는 호환 패키지
    - **podman-compose**: `docker-compose.yml` 파일을 Podman에서 실행할 수 있게 해주는 도구

---

## **3. Docker 호환 환경 구성**

MDRM은 Docker API를 기반으로 동작하므로, Podman에서도 Docker API를 사용할 수 있도록 소켓(Socket) 설정이 필요합니다.

### **Docker Socket 에뮬레이션 활성화**
```bash
# Podman 소켓 시작
systemctl enable --now podman.socket

# 소켓 링크 확인 (podman-docker 설치 시 자동 생성)
ls -al /var/run/docker.sock
```
> 결과가 `/run/podman/podman.sock`을 가리키고 있다면 정상입니다.

---

## **4. 서비스 시작 및 상태 확인**

Podman은 데몬(Daemon) 없이 동작하지만, API 소켓은 서비스로 관리됩니다.

```bash
# 서비스 상태 확인
systemctl status podman.socket

# Podman 버전 확인
podman version
```

---

## **5. Docker 명령어 별칭(Alias) 확인**

`podman-docker` 패키지를 설치하면 사용자가 `docker` 명령어를 입력해도 내부적으로 `podman`이 실행됩니다. 이는 기존 Docker 기반 스크립트를 그대로 사용할 수 있게 해줍니다.

```bash
# 별칭 동작 여부 확인
docker --version
```
> 출력 결과에 `podman version ...`이 포함되어 있으면 성공입니다.

---

<a href="../Podman_환경_설정/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚙️ Podman 환경 설정</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
