# 🚀 컨테이너 구성 정보

!!! info "학습 안내"
    MDRM 솔루션을 구성하는 주요 마이크로서비스들의 역할과 Docker Compose 환경 설정을 학습합니다. `docker-compose.yml` 파일을 통해 각 컨테이너의 역할과 상호작용을 이해할 수 있습니다.

## **1. 서비스 구성 개요**

MDRM은 가용성과 확장성을 확보하기 위해 마이크로서비스 아키텍처(MSA)를 채택하고 있습니다. 모든 주요 컴포넌트는 Docker 컨테이너로 실행되며, 이를 통합 관리하기 위해 Docker Compose를 사용합니다.

### **주요 컨테이너 역할 정의**

| 컨테이너 명 | 기능 및 역할 | 주요 포트 |
| :--- | :--- | :--- |
| **nginx-gateway** | 웹 서비스 진입점 (API Gateway 및 정적 파일 서빙) | 80, 443 |
| **mdrm-ui** / **dashboard-ui** | 관리자 콘솔 및 통합 대시보드 화면 | - |
| **mdrm-iam** | 계정 인증 및 권한 관리 (Keycloak 기반) | - |
| **mdrm-postgres** | 메인 시스템 데이터베이스 | 5433 |
| **mdrm-rabbitmq** | 각 서비스 간 통신을 위한 메시지 브로커 | 5673 |
| **mdrm-controller** | 솔루션의 핵심 비즈니스 로직 제어 | - |
| **workflow-controller** | 워크플로우 설계 및 복구 시나리오 엔진 | - |
| **task-worker** | 할당된 작업을 실제 수행하는 워커 유닛 | - |

## **2. 환경 변수 설정 (.env)**

`docker-compose.yml`에서 사용하는 동적 변수들은 같은 디렉토리에 위치한 `.env` 파일에 정의되어 있습니다. 설치 환경에 따라 이 파일의 내용을 수정하여 경로 및 포트를 변경할 수 있습니다.

```env
MDRM_HOME={{ extra.mdrm.path_data }}
HOSTNAME=UZOOGOM-LINUX
MDRM_PORT={{ extra.mdrm.server_port }}
```

### **주요 변수 설명**

| 변수명 | 용도 | 설명 |
| :--- | :--- | :--- |
| **MDRM_HOME** | 데이터 및 설정 저장 경로 | 솔루션의 바이너리, 로그, DB 데이터가 저장되는 최상위 경로입니다. |
| **HOSTNAME** | 서비스 접속 주소 (FQDN) | 웹 브라우저 접속 및 서비스 내부 인증 시 사용되는 호스트네임입니다. |
| **MDRM_PORT** | 서비스 리스닝 포트 | Nginx가 외부 요청을 받을 포트 번호입니다. |

## **3. docker-compose.yml 상세 분석**

MDRM 설치 디렉토리의 `docker-compose.yml` 설정 내용입니다. 이 설정은 서비스 간의 의존성, 볼륨 마운트, 환경 변수 등을 정의합니다.

!!! tip "환경 변수 활용"
    `docker-compose.yml` 내의 `${MDRM_HOME}`, `${HOSTNAME}` 등은 앞에서 살펴본 `.env` 파일의 값을 참조하여 동작합니다.

```yaml
services:
  mdrm-iam:
    image: docker-registry.mantech.co.kr/mdrm-iam:latest
    container_name: mdrm-iam
    hostname: mdrm-iam
    environment:
      - KC_HOSTNAME_ADMIN_URL=https://${HOSTNAME}/mdrm-iam # keycloak admin console
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - ${MDRM_HOME}/bin/config/keycloak/import:/opt/keycloak/data/import # realm info
      - ${MDRM_HOME}:/gampkgs/data
    depends_on:
      - mdrm-postgres
    networks:
      - mdrm
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"
    restart: always

  mdrm-postgres:
    image: docker-registry.mantech.co.kr/mdrm-postgres:latest
    container_name: mdrm-postgres
    hostname: mdrm-postgres
    volumes:
      - ${MDRM_HOME}/bin/config/postgresql/postgresql.conf:/etc/postgresql/postgresql.conf
      - ${MDRM_HOME}/bin/config/postgresql/pg_hba.conf:/etc/postgresql/pg_hba.conf
      - ${MDRM_HOME}/postgresql/data/16/main:/var/lib/postgresql/data
    ports:
      - "5433:5433"
    shm_size: 4gb
    networks:
      - mdrm
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  mdrm-rabbitmq:
    image: docker-registry.mantech.co.kr/mdrm-rabbitmq:latest
    container_name: mdrm-rabbitmq
    hostname: mdrm-rabbitmq
    volumes:
      - ${MDRM_HOME}/bin/config/rabbitmq/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf
    ports:
      - "5673:5673"
    networks:
      - mdrm
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  auth-controller:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: auth-controller
    hostname: auth-controller
    networks:
      - mdrm
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - gam-scripts:/gampkgs/scripts/
      - ${MDRM_HOME}/bin/app/auth-controller:/opt/mdrm
    environment:
      - spring.profiles.active=default,prod
      - CONTAINER_NAME=auth-controller
    depends_on:
      - mdrm-rabbitmq
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  workflow-controller:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: workflow-controller
    hostname: workflow-controller
    networks:
      - mdrm
    environment:
      - CONTAINER_NAME=workflow-controller
      - spring.profiles.active=default,prod
    volumes:
      - gam-scripts:/gampkgs/scripts
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - ${MDRM_HOME}:/gampkgs/data
      - ${MDRM_HOME}/bin/app/workflow-controller:/opt/mdrm
    depends_on:
      - mdrm-rabbitmq
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  alert-controller:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: alert-controller
    hostname: alert-controller
    networks:
      - mdrm
    environment:
      - CONTAINER_NAME=alert-controller
      - spring.profiles.active=default,prod
    volumes:
      - gam-scripts:/gampkgs/scripts
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - ${MDRM_HOME}/bin/app/alert-controller:/opt/mdrm
      - ${MDRM_HOME}:/gampkgs/data
    depends_on:
      - mdrm-rabbitmq
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  schedule-controller:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: schedule-controller
    hostname: schedule-controller
    networks:
      - mdrm
    volumes:
      - gam-scripts:/gampkgs/scripts/
      - ${MDRM_HOME}/bin/app/schedule-controller:/opt/mdrm
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
    environment:
      - CONTAINER_NAME=schedule-controller
      - spring.profiles.active=default,prod
    depends_on:
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  mdrm-controller:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: mdrm-controller
    hostname: mdrm-controller
    networks:
      - mdrm
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - ${MDRM_HOME}:/gampkgs/data
      - gam-scripts:/gampkgs/scripts/
      - ${MDRM_HOME}/bin/app/mdrm-controller:/opt/mdrm
    environment:
      - CONTAINER_NAME=mdrm-controller
      - spring.profiles.active=default,prod
    depends_on:
      - mdrm-rabbitmq
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  task-worker:
    image: docker-registry.mantech.co.kr/mdrm-base:latest
    container_name: task-worker
    hostname: task-worker
    networks:
      - mdrm
    environment:
      - CONTAINER_NAME=task-worker
      - spring.profiles.active=default,prod
    volumes:
      - gam-scripts:/gampkgs/scripts
      - ${MDRM_HOME}/bin/app/task-worker:/opt/mdrm
      - ${MDRM_HOME}:/gampkgs/data
    depends_on:
      - mdrm-rabbitmq
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  mdrm-logstash:
    image: docker-registry.mantech.co.kr/mdrm-logstash
    container_name: mdrm-logstash
    hostname: mdrm-logstash
    ports:
      - "5001:5001"
    restart: always
    volumes:
      - ${MDRM_HOME}/bin/config/logstash/config:/usr/share/logstash/config
      - ${MDRM_HOME}/bin/config/logstash/pipeline:/usr/share/logstash/pipeline
      - ${MDRM_HOME}/bin/config/logstash/jdbc:/usr/share/logstash/jdbc
    networks:
      - mdrm
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"
  mdrm-ui:
    image: docker-registry.mantech.co.kr/mdrm-ui:latest
    container_name: mdrm-ui
    hostname: mdrm-ui
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
    networks:
      - mdrm
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  dashboard-ui:
    image: docker-registry.mantech.co.kr/dashboard-ui:latest
    container_name: dashboard-ui
    hostname: dashboard-ui
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
    networks:
      - mdrm
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"
  nginx-gateway:
    image: docker-registry.mantech.co.kr/nginx-gateway
    container_name: nginx-gateway
    hostname: ${HOSTNAME}
    volumes:
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
      - ${MDRM_HOME}/bin/config/nginx/conf.d:/etc/nginx/conf.d/
      - gam-scripts:/gampkgs/scripts
      - ${MDRM_HOME}/:/gampkgs/data/
    ports:
      - "80:80"
      - "${MDRM_PORT}:${MDRM_PORT}"
    networks:
      - mdrm
    depends_on:
      - mdrm-ui
      - workflow-controller
      - gam
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

  gam:
    image: docker-registry.mantech.co.kr/gam:latest
    container_name: gam
    hostname: gam
    environment:
      - GAMHOSTNAME=${HOSTNAME}
    volumes:
      - gam-scripts:/gampkgs/scripts
      - ${MDRM_HOME}:/gampkgs/data
      - ${MDRM_HOME}/bin/config/ssl:/gampkgs/ssl/
    networks:
      - mdrm
    depends_on:
      - mdrm-rabbitmq
      - mdrm-postgres
    privileged: true
    restart: always
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "100m"

volumes:
  gam-scripts:
networks:
  mdrm:
```

## **4. 네트워크 및 스토리지 구성**

*   **네트워크 (Bridge)**: `mdrm`이라는 가상 네트워크를 통해 컨테이너 간 내부 통신이 이루어집니다.
*   **볼륨 마운트 (Persistence)**:
    *   `/gampkgs/data`: 공용 데이터 저장소
    *   `/var/lib/postgresql/data`: 데이터베이스 영구 저장 영역
    *   `/gampkgs/scripts`: 엔진 및 Agent 스크립트 공유 볼륨

<div class="next-step-card-container" markdown>
<a href="../MDRM_정지_및_종료/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🛑 MDRM 정지 및 종료</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
