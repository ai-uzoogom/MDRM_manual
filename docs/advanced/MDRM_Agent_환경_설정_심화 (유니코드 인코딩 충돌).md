# 🛠️ Agent 환경 설정 (심화)

!!! info "학습 안내"
    MDRM Agent의 동작 방식, 통신 포트, 보안 정책 및 성능 최적화를 제어하는 핵심 설정 파일들의 구조와 주요 파라미터를 상세히 학습합니다. (전체 레퍼런스 가이드)

---

## **1. application.properties**

Agent의 핵심 설정 파일로, 서버 연결, 보안, 실행 옵션 등을 관리합니다.

### **1.1 실행 옵션**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `server.port` | `{{ extra.agent.port }}` | Agent가 사용하는 포트 |
| `server.ssl.key-store` | `keystore.pfx` | HTTPS 사용 시 keystore 파일 경로 |
| `server.ssl.key-store-password` | `password` | HTTPS 사용 시 keystore 비밀번호 |
| `server.ssl.keyAlias` | `gam_agent` | Key alias |
| `logging.config` | `logback.xml` | Logback 설정 파일 경로 및 이름 |

---

### **1.2 MDRM 서버 연결**

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.agentId` | `N0000` | | MDRM 서버에서 관리하는 node_id |
| `mdrm.server.ip` | `{{ extra.mdrm.server_ip }}` | | MDRM 서버의 주소 (FQDN 또는 IP) |
| `mdrm.server.second.ip` | `-` | | MDRM 서버의 secondary IP (첫 번째 주소 접속 불가 시 사용) |
| `mdrm.server.port` | `{{ extra.mdrm.server_port }}` | | MDRM 서버의 웹 포트 |
| `mdrm.server.https` | `false` | | MDRM 서버 HTTPS 여부 (HTTPS 사용 시 `true`) |
| `mdrm.logstash.port` | `5001` | {{ extra.agent.version }} | 실시간 로깅 기능을 위한 Logstash 포트 번호 |
| `agent.heartbeat` | `60000` (1분) | | Heartbeat 전송 간격 (밀리초) |
| `agent.heartbeat.allowerror.count` | `3` | | 허용되는 Heartbeat 실패 횟수 |

!!! info "Heartbeat 허용 오류 횟수"
    설정한 횟수까지 Heartbeat이 실패하여도 통신 에러를 표시하지 않습니다.

---

### **1.3 WATCHDOG**

Agent 프로세스를 감시하고 자동으로 재시작하는 기능 관련 설정입니다.

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.https.enabled` | `false` | | Agent HTTPS 사용 여부 |
| `check.agent.service.check.interval` | `5000` (5초) | 1.2.1 | Watchdog이 Agent를 감시하는 간격 |
| `agent.allow.max.error.times` | `4` | 1.2.1 | 최대 허용 REST API 체크 실패 횟수 (초과 시 Agent 재시작) |
| `check.total.restart.limit` | `3` | 1.2.1 | 최대 허용 Agent 재시작 횟수 (초과 시 재시작 중단) |
| `check.agent.service.start.check.delay` | `20000` (20초)<br>`60000` (60초) | 1.2.1<br>1.2.11 | 재시작 후 대기 시간 (이 시간 동안 체크하지 않음) |
| `agent.service.script` | Linux/Unix: `bin/unix_service.sh`<br>Windows: `bin\\service_monitor.ps1` | | Agent 실행 여부 확인 및 재시작용 스크립트 |
| `check.agent.monitor.check.enabled` | `false` | 1.2.8 | 모니터링 스크립트 사용 유무 |
| `check.agent.monitor.check.script` | `bin/mtr/check_cpu_rate.sh` | 1.2.8 | 모니터링 스크립트 경로 |
| `check.agent.monitor.check.cron` | `*/10 * * * * *` | 1.2.8 | 모니터링 스크립트 실행 주기 (기본: 10초) |

!!! tip "Cron Expression"
    Spring Cron Expression 사용법: [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/support/CronExpression.html)

---

### **1.4 보안**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `mdrm.debug.mode` | `true` | 비밀번호로 Agent 접근 가능 여부<br>• `true`: 서버에 Agent를 수동 설치할 경우 (기본값)<br>• `false`: MDRM에 서버 추가/가져오기 후 자동 변경 |
| `agent.free.session` | `p*******` | `mdrm.debug.mode`가 `true`일 때 Agent 접근용 비밀번호 |

---

### **1.5 스레드**

멀티 스레드로 컴포넌트를 실행하기 위한 설정입니다.

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.thread.corepoolsize` | `20` | 1.2.7 | 대기 중인 스레드 수 |
| `agent.thread.maxpoolsize` | `40` | 1.2.7 | 최대 사용 가능한 스레드 수 |
| `agent.thread.queuecapacity` | `100` | 1.2.7 | 대기 작업 수 (초과 시 에러 처리) |

---

### **1.6 실행**

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.exec.async.waiting.secs` | `60` (초) | 1.2.7 | 동기 실행 시 응답 대기 시간 (초과 시 비동기로 전환) |
| `agent.exec.remove.status.milsecs` | `60000` (밀리초) | 1.2.7 | 실행 완료 후 결과값 보관 시간 |
| `agent.server.runas_command` | `su - {user} -c {command}` | 1.2.10 | 명령어 실행 방식<br>• su 방식: `su - {user} -c {command}`<br>• sudo 방식: `sudo -p '' -u {user} {command}` |

!!! note "실행 방식"
    `agent.server.runas_command`는 Linux와 Unix 계열 서버에만 적용됩니다.

---

### **1.7 실행 Output**

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.output.head.max` | `-1` | 1.2.9 | 컴포넌트 실행 output에서 앞에서부터 남길 줄 수 |
| `agent.output.tail.max" | `-1` | 1.2.9 | 컴포넌트 실행 output에서 뒤에서부터 남길 줄 수 |

---

### **1.8 파일 실행 (사용자 정의)**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `agent.temp.path` | `null` | 파일 저장 경로 |

---

### **1.9 기타**

| 옵션 키(key) | 기본값(value) | 버전 | 설명 |
|:---|:---|:---:|:---|
| `agent.init.command` | | | Agent 시작 시 한 번 실행하는 스크립트 |
| `shell.cmd.option.windows` | `/q /c @` | 1.2.2 | Windows에서 스크립트 실행 시 옵션 |
| `spring.http.multipart.max-file-size` | `100MB` | 1.2.4 | 최대 업로드 허용 파일 크기 |
| `spring.http.multipart.max-request-size` | `100MB` | 1.2.4 | 최대 업로드 허용 요청 크기 |
| `spring.profiles.active` | | 1.3.0 | 실시간 로깅 기능 동작 옵션<br>• `real_time`: 실시간 로깅 기능 동작 |

---

### **1.10 쿼럼**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `mccs.home.path` | `/opt/MCCS` | MCCS Home 경로 |
| `mccs.port` | `10080` | MCCS 포트 |
| `mccs.https.enabled` | `true` | MCCS HTTPS 사용 여부 |

---

## **2. gam_agent.conf**

JVM 및 Agent 실행 환경을 설정하는 파일입니다.

### **2.1 JVM 설정**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `JAVA_HOME` | `{{ extra.agent.install_path }}/jre` | Java Home 경로 |
| `JAVA_OPTS` | `"-Xmx64M -Xms128M -XX:MaxPermSize=128M -Djava.io.tmpdir={{ extra.agent.install_path }}/tmp -server"` | JVM 실행 옵션 |

### **2.2 기타 설정**

| 옵션 키(key) | 기본값(value) | 설명 |
|:---|:---|:---|
| `LOG_FOLDER` | `{{ extra.agent.install_path }}/logs` | 로그 저장 폴더 경로 |

---

## **3. 설정 변경 시 주의사항**

!!! warning "설정 변경 후 재시작 필요"
    `application.properties` 또는 `gam_agent.conf` 파일을 수정한 후에는 반드시 Agent를 재시작해야 변경사항이 적용됩니다.

```bash
# Agent 재시작 (Linux/Unix)
cd {{ extra.agent.install_path }}
./bin/unix_service.sh restart
```

!!! danger "중요 설정 변경 시 주의"
    다음 설정을 변경할 때는 특히 주의가 필요합니다:
    
    - `server.port`: 방화벽 설정도 함께 변경 필요
    - `mdrm.server.ip`: MDRM 서버 주소 변경 시 연결 끊김
    - `agent.agentId`: 잘못 변경 시 MDRM 서버에서 인식 불가

---
