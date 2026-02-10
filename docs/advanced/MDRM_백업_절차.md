# 💾 MDRM 백업 절차 가이드

MDRM의 데이터를 안전하게 보호하기 위한 백업 절차 및 자동화 스크립트입니다.
본 가이드는 MDRM 서비스를 일시 중지(Stop)하고 데이터를 백업(Cold Backup)하는 방식을 기준으로 합니다.

---

## **1. 수동 백업 절차 (Step-by-Step)**

### **1.1 컨테이너 중지**
데이터 정합성을 위해 실행 중인 모든 MDRM 컨테이너를 중지합니다.

```bash
# docker-compose 파일이 있는 경로로 이동 (예: {{ extra.mdrm.bin_path }})
cd {{ extra.mdrm.bin_path }}/
docker compose stop
```

### **1.2 백업 디렉터리 이동**
백업 파일을 저장할 디렉터리로 이동합니다.

```bash
# 백업 디렉터리가 없다면 생성
mkdir -p /mdrm/backup
cd /mdrm/backup
```

### **1.3 데이터 디렉터리 백업**
MDRM의 데이터가 저장된 디렉터리(`{{ extra.mdrm.path_data }}`)를 압축하여 백업합니다.

```bash
# tar czf <백업파일명> <대상디렉터리>
# 예시: mdrm_backup_YYYYMMDD.tgz 형식으로 생성
tar czf mdrm_backup_$(date +%Y%m%d).tgz {{ extra.mdrm.path_data }}
```

### **1.4 오래된 백업 삭제**
디스크 공간 확보를 위해 30일이 지난 백업 파일은 삭제합니다.

```bash
# 수정일 기준 30일 이상 지난 파일 검색 및 삭제
find /mdrm/backup -name "mdrm_backup_*.tgz" -mtime +30 -delete
```

### **1.5 컨테이너 시작**
백업이 완료되면 서비스를 다시 시작합니다.

```bash
cd {{ extra.mdrm.bin_path }}
docker compose start
```

### **1.6 서비스 정상 확인**
웹 서비스가 정상적으로 구동되었는지 HTTP 상태 코드로 확인합니다. (200 OK 등)

```bash
# -k: SSL 인증서 무시, -I: 헤더만 조회
curl -k -I https://127.0.0.1
# 결과 예시: HTTP/1.1 200 OK 또는 302 Found
```

---

## **2. 자동화 스크립트 예시 (backup.sh)**

위의 모든 과정을 자동으로 수행하는 쉘 스크립트입니다. `crontab` 등에 등록하여 주기적으로 실행할 수 있습니다.

```bash title="backup_mdrm.sh"
#!/bin/bash

# ==========================================
# MDRM 데이터 백업 스크립트
# ==========================================

# 1. 환경 설정
BACKUP_DIR="/mdrm/backup"          # 백업 저장 경로
DATA_DIR="{{ extra.mdrm.path_data }}"              # 백업 대상 데이터 경로
COMPOSE_DIR="{{ extra.mdrm.bin_path }}"         # Docker Compose 파일 경로
DATE_TAG=$(date +%Y%m%d_%H%M%S)    # 날짜 태그
BACKUP_FILE="$BACKUP_DIR/mdrm_backup_$DATE_TAG.tgz"
RETENTION_DAYS=30                  # 백업 보관 기간(일)
LOG_FILE="$BACKUP_DIR/backup.log"  # 로그 파일

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 백업 디렉터리 생성
mkdir -p "$BACKUP_DIR"

log "=== Start Backup Process ==="

# 2. MDRM 컨테이너 중지
log "Stopping MDRM containers..."
cd "$COMPOSE_DIR" || { log "Error: Compose dir not found"; exit 1; }
/usr/local/bin/docker-compose stop

# 3. 데이터 디렉터리 압축 백업
log "Archiving data directory ($DATA_DIR)..."
tar czf "$BACKUP_FILE" "$DATA_DIR"

if [ $? -eq 0 ]; then
    log "Backup SUCCESS: $BACKUP_FILE"
else
    log "Backup FAILED!"
    # 실패하더라도 서비스는 다시 띄워야 함
    /usr/local/bin/docker-compose start
    exit 1
fi

# 4. 30일 지난 백업 파일 삭제
log "Cleaning up old backups (+${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "mdrm_backup_*.tgz" -mtime +$RETENTION_DAYS -print -delete >> "$LOG_FILE"

# 5. MDRM 컨테이너 시작
log "Starting MDRM containers..."
/usr/local/bin/docker-compose start

# 6. 서비스 상태 확인
log "Waiting for service to be ready (30 sec)..."
sleep 30

# HTTP 상태 코드 확인 (200 또는 302면 정상)
HTTP_STATUS=$(curl -k -o /dev/null -s -w "%{http_code}" https://127.0.0.1)

if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "302" ]]; then
    log "Service Check: OK (Status: $HTTP_STATUS)"
else
    log "Service Check: WARNING (Status: $HTTP_STATUS)"
fi

log "=== Backup Process Completed ==="
```
