# ⏫ MDRM 업그레이드 가이드

!!! info "가이드 대상 버전"
    이 문서는 **MDRM v4.6.8** 업그레이드 기준으로 작성되었습니다.

    *   **원본 문서**: [MDRM Upgrade Guide (v4.6.8)](https://mantech.jira.com/wiki/spaces/MDRM/pages/4798545933/MDRM+Upgrade+Guide+v4.6.8)

---

## **1. 사전 점검 및 가정**

이 문서는 다음 환경을 전제로 작성되었습니다.

*   **기존 환경**: Docker 엔진 및 Docker-compose로 운영 중
*   **설치 경로**: `/opt` (설치 디렉터리)
*   **데이터 경로**: `/opt/gam` (볼륨 마운트)
*   **대상 버전**: MDRM v4.6.8 (Podman 권장)

!!! warning "데이터 삭제 및 정리 권고"
    과거 모니터링 데이터가 너무 많을 경우 DB 마이그레이션 시간이 매우 길어질 수 있습니다.
    업그레이드 전, 보존 기한이 지난 불필요한 데이터는 미리 삭제하는 것을 강력히 권장합니다.

---

## **2. 업그레이드 전 백업**

업그레이드 실패 시 복구를 위해 데이터 백업은 필수입니다.

### **2.1 데이터 영역 백업 (필수)**

MDRM의 모든 설정과 DB 데이터가 저장된 볼륨 디렉터리를 백업합니다.

```bash
# 1. 기존 컨테이너 중지
cd /opt
docker-compose stop

# 2. 데이터 영역 복사 (예: /opt/gam -> /opt/gambackup)
# 디스크 여유 공간을 확인 후 진행하십시오.
cp -rf /opt/gam /opt/gambackup/
```

### **2.2 Nagios 플러그인 백업 (선택)**

사용자 정의 모니터링 플러그인을 사용하는 경우 별도 백업이 필요합니다.

```bash
# 1. 백업 디렉터리 생성
mkdir -p /opt/gambackup/nagios

# 2. 플러그인 파일 추출 (실행 중인 컨테이너에서 복사해야 함)
# 컨테이너가 중지된 상태라면 cp 명령 대신 마운트된 경로에서 직접 복사하세요.
# (컨테이너 실행 중일 때)
docker cp gam:/usr/local/nagios/libexec/<Library_name> /opt/gambackup/nagios/
```

---

## **3. 업그레이드 절차**

### **3.1 기존 환경 정리**

기존 컨테이너와 이미지를 제거하여 충돌을 방지합니다.

**MDRM 4.6.3 이전 버전인 경우:**
```bash
cd /opt
docker-compose down
```

**MDRM 4.6.3 이후 버전인 경우:**
```bash
# bin 디렉터리에 compose 파일이 존재함
cd /opt/gam/bin
docker-compose down
```

**이미지 및 잔여 파일 정리:**
```bash
# 사용하지 않는 이미지 일괄 삭제
docker image prune -af

# (중요) 데이터 영역(/opt/gam)을 제외한 나머지 프로그램 파일 삭제
# /opt 디렉터리 내의 이전 설치 파일들을 정리합니다.
# 주의: /opt/gam 디렉터리는 절대 삭제하면 안 됩니다!
```

### **3.2 컨테이너 엔진 전환 (Docker → Podman)**

MDRM 4.6.8 부터는 RHEL/CentOS 8 호환성을 위해 **Podman**을 권장합니다.
Docker와 Podman은 동시에 사용할 수 없으므로 Docker를 중지합니다.

```bash
# Docker 중지 및 비활성화
systemctl stop docker
systemctl disable docker
```

!!! tip "Podman 설치"
    Podman이 설치되어 있지 않다면 [Podman 설치 가이드](../day1/Podman_설치_가이드.md)를 먼저 수행하십시오.

### **3.3 신규 버전 설치 준비**

```bash
# 1. 설치 디렉터리로 이동
cd /opt/

# 2. 설치 파일 압축 해제
tar -zxvf mdrm468.tar.gz
```

### **3.4 DB 마이그레이션 (4.6.3 이전 버전만 해당)**

PostgreSQL 버전을 13에서 16으로 업그레이드하는 과정입니다.
(이미 4.6.3 이상 버전을 사용 중이라면 이 단계는 생략합니다.)

```bash
cd /opt/mdrm468/upgrade

# upgrade.sh <데이터 경로>
./upgrade.sh /opt/gam
```

**마이그레이션 옵션:**
*   **데이터 정리 여부**: 스크립트 실행 중 오래된 데이터 삭제 여부를 묻습니다.
    *   `y`: 보관 기간(개월)을 입력받아 그 이전 데이터 삭제. (속도 빠름)
    *   `n`: 모든 데이터를 유지하며 마이그레이션. (시간 오래 걸림)

**진행 상황 확인:**
```bash
podman logs -f pgcopy_migrator
```

**완료 확인:**
`/opt/gam/config/DBVersion` 파일이 생성되었는지 확인합니다.
```bash
cat /opt/gam/config/DBVersion
# 출력: 160008 (PostgreSQL 16)
```

### **3.5 설치 스크립트 실행**

마지막으로 최신 버전의 컨테이너를 배포합니다.

```bash
cd /opt/mdrm468

# 사용법: ./install.sh <HOSTNAME> <DATA_DIR> [PORT]
./install.sh mdrm.mantech.co.kr /opt/gam
```

| 인자 | 설명 | 기본값 |
| :--- | :--- | :--- |
| **Hostname** | MDRM 서버의 FQDN 또는 IP | 필수 |
| **Data Dir** | 데이터가 저장될 절대 경로 (예: `/opt/gam`) | 필수 |
| **Port** | 웹 콘솔 접속 포트 (입력 생략 시 443) | 443 |

설치가 완료되면 수 분 후 웹 콘솔(`https://<Hostname>:Port`)에 접속하여 정상 동작을 확인합니다.
