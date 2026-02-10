# 🔌 시스템 포트 변경 가이드

!!! info "학습 안내"
    MDRM 솔루션 운영 중 보안 정책이나 포트 충돌로 인해 포트 번호를 변경해야 하는 경우의 조치 방법입니다. **MDRM 서버 자체의 접속 포트**를 변경하는 방법과, **에이전트 통신 포트 변경 시 MDRM 서버에서 수행해야 할 작업**을 상세히 안내합니다.

    *   **원본 문서 (MDRM WEB)**: [포트번호 변경 가이드 (v4.6.3~)](https://mantech.jira.com/wiki/x/DwCAFgE)
    *   **원본 문서 (Agent)**: [gam agent - 20080 포트 변경](https://mantech.jira.com/wiki/x/aQKs4g)

!!! tip "외부 링크 안내"
    매뉴얼 내의 모든 외부 링크(Jira, Wiki 등)는 사용 편의를 위해 클릭 시 **새 창(새 탭)**에서 자동으로 열리도록 설정되어 있습니다.

---

## **1. MDRM 서버 포트 변경 (Web Console)**

MDRM 웹 콘솔 접속에 사용하는 기본 포트(TCP 443)를 특정 포트(예: 3100)로 변경하는 절차입니다. 이 작업은 **MDRM v4.6.3 이상** 버전을 기준으로 합니다.

!!! warning "권장 사항: 재설치"
    MDRM의 포트 번호를 변경하는 **가장 확실하고 안정적인 방법은 재설치**입니다. 데이터 영역(`{{ extra.mdrm.path_data }}`)을 백업한 뒤, `install.sh` 실행 시 세 번째 인자로 포트 번호를 지정하여 재설치하는 것을 권장합니다.
    ```bash
    # 예시: 3100 포트로 재설치
    ./install.sh $(hostname) {{ extra.mdrm.path_data }} 3100
    ```

### **1.1 설정 파일 수정**
재설치가 불가능한 경우 아래 파일들을 수동으로 수정합니다.

**① docker-compose.yml 수정**

*   **파일 위치**: `{{ extra.mdrm.path_data }}/bin/docker-compose.yml`
*   `nginx-gateway` 서비스의 포트 매핑을 수정합니다.
    ```yaml
    services:
      nginx-gateway:
        ports:
          - "3100:443" # 호스트의 3100 포트를 컨테이너의 443으로 매핑
    ```

**② wind-config.properties 수정**

*   **파일 위치**: `{{ extra.mdrm.path_data }}/config/wind-config.properties`
    ```properties
    # [변경 전] server.port=443
    server.port=3100
    ```

### **1.2 UI 컨테이너 내부 패치 (필수)**
웹 콘솔에서 API를 호출할 때 변경된 포트를 바라보도록 소스를 수정해야 합니다. 제조사로부터 제공받은 패치 스크립트를 사용합니다.

1.  **대시보드 UI 패치**:
    ```bash
    docker cp dashboard_patch.sh dashboard-ui:/usr/share/nginx/html
    docker exec -it dashboard-ui sh
    ./dashboard_patch.sh 3100
    exit
    ```

2.  **MDRM UI 패치**:
    ```bash
    docker cp mdrmui_patch.sh mdrm-ui:/usr/share/nginx/html
    docker exec -it mdrm-ui sh
    ./mdrmui_patch.sh 3100
    exit
    ```

3.  **Docker 커밋 (변경사항 영구 저장)**:
    컨테이너가 재생성되어도 패치 내용이 유지되도록 현재 상태를 이미지로 커밋합니다.
    ```bash
    docker commit dashboard-ui {dashboard-ui_IMAGE_NAME}
    docker commit mdrm-ui {mdrm-ui_IMAGE_NAME}
    ```

---

## **2. 에이전트 통신 포트 변경 (MDRM 서버 작업)**

GAM 에이전트의 기본 포트(20080)를 변경하여 사용할 경우, MDRM 서버에서 수행해야 하는 작업 가이드입니다.

!!! info "통신 포트 개요"
    GAM 에이전트의 기본 포트 정보는 **20080**을 사용하고 있습니다. 고객사에서 20080 포트 사용 불가 시 에이전트의 포트 번호를 변경하여 사용하는 방법을 공유합니다. 
    *   **지원 버전**: MDRM 4.6.1, 4.6.2 이상부터 가능
    *   **제약 사항**: 현재 포트를 노드별로 개별 지정할 수 없습니다.

### **2.1 [v4.6.1 이전] 환경설정 파일 변경**
GAM 컨테이너 내부의 환경설정 파일을 직접 수정합니다.

1.  **설정 파일 편집**:
    ```bash
    $ docker exec -it gam bash
    vi /gampkgs/data/config/wind-config.properties
    ```
2.  **포트 정보 수정** (`20080` → `20081` 예시):
    `wind.dr.agent.port` 항목의 포트 정보를 수정합니다.
3.  **재시작**: 수정 사항 적용을 위해 톰캣 또는 컨테이너를 재시작합니다.
    ```bash
    # gam 컨테이너 내 tomcat 재시작
    service tomcat8 restart 
    # gam 컨테이너 재시작
    docker restart gam 
    ```

**적용 범위**: 시스템 에이전트 연결 테스트, 시스템 요약, 점검 작업, 워크플로우 (4.6.1 이하)

### **2.2 [v4.6.2 이상] DB 변경**
4.6.2 이상 버전에서는 DB 값을 수정해야만 워크플로우에서 변경된 포트 번호로 실행이 가능합니다. **반드시 2.1 항의 환경설정을 같이 진행해야 합니다.**

1.  **DB 접속 및 포트 변경**:
    ```bash
    docker exec -it mdrm-postgres bash 
    psql -p 5433 -U mccs
    update accounts set conn_port = '20081' where acc_id = 0 ;
    ```
2.  **결과 확인**: DB 데이터 변경 후 별도의 컨테이너 재시작 없이 바로 적용됩니다.

**적용 범위**: 워크플로우 (4.6.2 이상)

---

!!! success "최종 확인"
    모든 포트 변경 작업이 완료된 후에는 반드시 웹 콘솔의 **[시스템 관리]** 메뉴에서 **'에이전트 연결 테스트'**를 수행하여 통신 상태가 정상(OK)인지 확인하시기 바랍니다.
