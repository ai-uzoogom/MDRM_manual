# 🐧 Agent 수동 설치 (Linux)

!!! info "학습 안내"
    보안이 강화된 Linux 환경에서 Agent 패키지를 직접 설치하고 서비스를 안정적으로 기동시키는 절차를 학습합니다.

---

## **1. Agent 설치 절차**

대상 서버에 접속하여 다음 명령어를 순차적으로 실행합니다.

```bash
# 1. 설치 디렉토리 생성
mkdir -p {{ extra.agent.install_path }}

# 2. 설치 경로로 이동 및 압축 해제
cd {{ extra.agent.install_path }}
tar zxvf {{ extra.agent.pkg_linux }}

# 3. 설치 스크립트 실행
# 형식: ./install.sh [설치경로] [포트] [HTTPS사용여부(기본값 true)]
./install.sh {{ extra.agent.install_path }} {{ extra.agent.port }}
```

---

## **2. 설치 및 가동 확인**

설치가 완료되면 Agent는 기본적으로 자동으로 가동됩니다. 다음 명령어로 프로세스 상태를 확인합니다.

```bash
ps -ef | grep [g]am_agent
```

**정상 가동 시 출력 예시:**
```bash
root 14995 {{ extra.agent.install_path }}/jre/bin/java -jar {{ extra.agent.install_path }}/gam_agent_watchdog.jar start
root 15010 {{ extra.agent.install_path }}/jre/bin/java -jar {{ extra.agent.install_path }}/gam_agent.jar start
```

### **2.1 주요 프로세스 설명**
- **`gam_agent.jar`**: Agent 서비스의 핵심 주체입니다.
- **`gam_agent_watchdog.jar`**: Agent 프로세스의 생존 여부를 감시하고 장애 시 자동으로 재기동합니다.

---

## **3. 안정적인 연동을 위한 재시작**

!!! warning "주의 사항"
    수동 설치 직후에는 프로세스가 불안정할 수 있어 MDRM 서버에서의 '가져오기' 작업 시 일시적인 장애가 발생할 수 있습니다. 안전한 연동을 위해 다음 명령어로 Agent를 완전히 재시작할 것을 권장합니다.

```bash
# 1. 서비스 중지 및 잔류 프로세스 제거
systemctl stop gam_agent
pkill -ecf gam_agent

# 2. 서비스 시작
systemctl start gam_agent

# 3. 리스닝 포트 확인 ({{ extra.agent.port }})
ss -antpl | grep {{ extra.agent.port }}
```

---

## **4. 설정 파일 비교: 수동 설치 vs 가져오기 후**

수동 설치 직후의 기본 설정과 MDRM 웹 콘솔에서 '가져오기' 연동이 완료된 후의 `application.properties` 파일을 비교합니다.

수동 설치 시에는 대기 상태이므로 `mdrm.debug.mode=true`를 유지하지만, 가져오기가 완료된 이후에는 `mdrm.debug.mode=false`로 변경되며 보안 연결(HTTPS)을 위한 설정들이 자동으로 추가됩니다.

<div class="grid cards" markdown>

-   __수동설치 기본 (가져오기 전)__

    ```properties hl_lines="6"
    agent.agentId=N0000
    agent.heartbeat=10000
    mdrm.server.ip=127.0.0.1
    mdrm.server.port=80
    mdrm.server.https=false
    mdrm.debug.mode=true
    logging.config=logback.xml
    ```

-   __가져오기 실행 후__

    ```properties hl_lines="2 3 5 6 10 11"
    server.port=20080
    agent.agentId=N0001
    mdrm.server.ip=MDRM_IP
    mdrm.server.port=443
    mdrm.server.https=true
    mdrm.debug.mode=false
    agent.heartbeat=10000
    agent.temp.path=/opt/gam_agent/storage
    agent.service.script=/opt/gam_agent/bin/unix_service.sh
    server.ssl.key-store=keystore.pfx
    server.ssl.key-store-password=password
    server.ssl.keyAlias=gam_agent
    agent.https.enabled=true
    logging.config=logback.xml
    agent.server.runas_command=su - {user} -c {command}
    mdrm.logstash.port=5001
    spring.profiles.active=prod
    ```

    !!! tip "중요 확인 사항"
        가져오기 이후에는 `mdrm.debug.mode=false`로 정상 변경되었는지와 함께, 설정된 `keystore.pfx` 인증서 파일이 에이전트 설치 경로에 실제로 생성되었는지 반드시 확인이 필요합니다.

</div>

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_Agent_수동설치_윈도우/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🪟 수동설치 (Windows)</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
