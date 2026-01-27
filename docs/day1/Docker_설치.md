# 🐳 Docker 설치 (Official Repo)

이 가이드는 RHEL, Rocky Linux 등 RPM 기반 시스템에서 Docker 공식 Repository를 사용하여 최신 버전의 Docker 엔진을 설치하는 방법을 안내합니다.

---

## **1. 기존 버전 제거**

설치 시 충돌을 방지하기 위해, 이전에 설치되어 있던 `docker` 또는 `docker-engine` 관련 패키지를 먼저 제거해 주십시오.

```bash
yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

## **2. Repository 설정**

Docker 공식 Repository를 등록하기 위해 필요한 유틸리티 패키지를 설치하고 저장소를 시스템에 추가해 주십시오.

```bash
# 필수 패키지 설치
yum install -y yum-utils

# Docker 공식 Repository 추가 (Rocky Linux/RHEL 공용)
yum-config-manager \
    --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

!!! info "기술 사양 안내"
    Docker 공식 저장소는 Rocky Linux용 별도 경로 대신 `centos` 하위 경로를 공용으로 사용합니다. 이는 Docker의 공식 배포 정책에 따른 정상적인 설정입니다.

## **3. Docker Engine 설치**

시스템에 최신 버전의 Docker 엔진 및 Docker Compose 플러그인을 설치해 주십시오.

```bash
yum install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
```

## **4. 서비스 시작 및 활성화**

설치가 완료되면 Docker 서비스를 시작하고, 시스템 부팅 시 자동으로 실행되도록 설정합니다.

```bash
# Docker 서비스 시작
systemctl start docker

# 부팅 시 자동 시작 설정
systemctl enable docker

# 설치 및 상태 확인
docker version
systemctl status docker
```

---

!!! tip "Docker Compose 사용 확인"
    최신 방식인 `docker compose` 명령어를 기본으로 사용합니다. (하이픈 없이 사용)

    **버전 확인:**
    ```bash
    docker compose version
    ```

---

<a href="../Docker_설정/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚙️ Docker 환경 설정</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
