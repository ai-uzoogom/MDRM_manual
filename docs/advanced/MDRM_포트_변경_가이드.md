# 🔌 포트번호 변경 가이드

!!! info "가이드 대상 버전"
    이 문서는 **MDRM v4.6.3 이상** 버전을 기준으로 작성되었습니다.
    
    *   **원본 문서**: [포트번호 변경 가이드 (v4.6.3~)](https://mantech.jira.com/wiki/spaces/MDRM/pages/4672454671/v4.6.3~)

!!! warning "권장 사항: 재설치"
    MDRM의 포트 번호를 변경하는 **가장 확실하고 안정적인 방법은 재설치**입니다.
    
    데이터 영역(`/opt/gam`)을 백업한 뒤, `install.sh` 실행 시 세 번째 인자로 포트 번호를 지정하여 재설치하는 것을 권장합니다.
    ```bash
    # 예시: 3100 포트로 재설치
    ./install.sh {HOSTNAME} {DATA_DIR} 3100
    ```
    본 가이드는 재설치가 불가능한 상황에서 기존 운영 환경의 설정을 직접 변경하는 방법을 다룹니다.

---

## **1. 개요 및 사전 준비**

MDRM은 기본적으로 **TCP 443** 포트를 사용합니다. 보안 정책이나 포트 충돌 등의 사유로 이를 변경해야 할 경우(예: **3100번**), 여러 설정 파일과 UI 컨테이너 내부의 설정을 모두 변경해야 합니다.

### **변경 대상 파일**
1.  `bin/docker-compose.yml`
2.  `config/nginx/conf.d/nginx.conf`
3.  `config/wind-config.properties`
4.  UI 컨테이너 내부 패치 (`dashboard-ui`, `mdrm-ui`)

---

## **2. 설정 파일 수정**

볼륨 마운트 된 경로에 있는 설정 파일들을 수정합니다.

### **2.1 docker-compose.yml 수정**

`nginx-gateway` 서비스의 포트 매핑과 `gam` 서비스의 환경 변수를 수정합니다.

*   **파일 위치**: `{MDRM_HOME}/bin/docker-compose.yml`

```yaml
services:
  nginx-gateway:
    # ...
    ports:
      # [변경 전]
      # - "443:443"
      # [변경 후] 호스트의 3100 포트를 컨테이너의 443(또는 내부 변경 포트)으로 매핑
      # 주의: nginx.conf 내부 listen 포트도 변경했다면 그에 맞춰야 함.
      # 보통은 호스트 포트만 변경합니다.
      - "3100:443"
    
  gam:
    environment:
      # [변경 후] GAM_PORT 환경변수 추가 또는 수정 (필요 시)
      - GAM_PORT=3100
```

### **2.2 nginx.conf 수정**

NGINX Gateway의 설정을 변경합니다. 버전 업그레이드 시 이 파일이 초기화될 수 있으므로 재적용이 필요할 수 있습니다.

*   **파일 위치**: `{MDRM_HOME}/config/nginx/conf.d/nginx.conf`

**수정 내용**:
`server` 블록 내의 `listen` 포트나 리다이렉트 설정을 확인합니다. (외부 포트 변경 시 `Host` 헤더 관련 설정 확인 필요)

### **2.3 wind-config.properties 수정**

GAM 컨테이너가 참조하는 환경 설정을 변경합니다.

*   **파일 위치**: `{MDRM_HOME}/config/wind-config.properties`

```properties
# [변경 전]
# server.port=443

# [변경 후]
server.port=3100
```

---

## **3. 적용 및 재가동**

수정한 설정 파일을 적용하기 위해 컨테이너를 재시작합니다.

```bash
cd {MDRM_HOME}/bin

# 컨테이너 종료 및 삭제
docker-compose down

# 컨테이너 생성 및 실행
docker-compose up -d
```

---

## **4. UI 컨테이너 내부 패치 (필수)**

웹 콘솔(UI)에서 API를 호출할 때 변경된 포트를 바라보도록, 컴파일된 소스(Javascript 등)를 수정해야 합니다. 이를 위해 제공되는 패치 스크립트를 사용합니다.

!!! warning "스크립트 파일 필요"
    본 작업을 수행하려면 제조사(맨텍솔루션)로부터 제공받은 `dashboard_patch.sh` 및 `mdrmui_patch.sh` 파일이 필요합니다.

### **4.1 대시보드 UI 패치**

1.  **파일 복사**: 스크립트를 컨테이너로 복사합니다.
    ```bash
    docker cp dashboard_patch.sh dashboard-ui:/usr/share/nginx/html
    ```

2.  **스크립트 실행**:
    ```bash
    # 컨테이너 접속
    docker exec -it dashboard-ui sh
    
    # 패치 실행 (인자로 변경할 포트 번호 입력)
    ./dashboard_patch.sh 3100
    exit
    ```

### **4.2 MDRM UI 패치**

1.  **파일 복사**:
    ```bash
    docker cp mdrmui_patch.sh mdrm-ui:/usr/share/nginx/html
    ```

2.  **스크립트 실행**:
    ```bash
    # 컨테이너 접속
    docker exec -it mdrm-ui sh
    
    # 패치 실행
    ./mdrmui_patch.sh 3100
    exit
    ```

### **4.3 Docker 커밋 (변경사항 영구 저장)**

컨테이너 내부를 직접 수정했으므로, 컨테이너가 재생성되더라도 패치 내용이 유지되도록 현재 상태를 이미지로 `commit` 해야 합니다.

```bash
# 1. 컨테이너 ID 및 이미지 이름 확인
docker ps | grep ui

# 2. 대시보드 UI 커밋
docker commit {dashboard-ui_CONTAINER_ID} {dashboard-ui_IMAGE_NAME}
# 예: docker commit a1b2c3d4e5 mantech/mdrm-dashboard-ui:4.6.3

# 3. MDRM UI 커밋
docker commit {mdrm-ui_CONTAINER_ID} {mdrm-ui_IMAGE_NAME}
```

---

## **5. 최종 확인**

브라우저를 열고 변경된 포트(`https://{MDRM_IP}:3100`)로 접속하여 다음 기능이 정상 동작하는지 확인합니다.

1.  **로그인 화면**: 정상 출력 및 로그인 가능 여부
2.  **대시보드**: 위젯 데이터 로딩 확인
3.  **시스템**: 서버 목록 조회 확인
4.  **워크플로우**: 워크플로우 편집 및 조회 확인
