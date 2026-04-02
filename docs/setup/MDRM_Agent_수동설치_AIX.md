# 🏢 Agent 수동 설치 (유닉스/AIX)

!!! info "학습 안내"
    AIX(IBM Unix) 환경에서 Agent 패키지를 수동으로 설치하고 전용 구동 스크립트를 사용하여 서비스를 기동하는 절차를 학습합니다. AIX는 OS 특성상 systemd를 사용하지 않으므로 전용 쉘 스크립트(`watchdog_service.sh`)를 활용합니다.

---

## **1. 사전 준비 (Java 확인)**

MDRM Agent 구동을 위해서는 Java Runtime Environment(JRE) 1.8 이상이 반드시 필요합니다. AIX 환경은 패키지에 내장 JRE를 포함하지 않으므로, 시스템에 설치된 Java 경로를 `JAVA_HOME`으로 설정해야 합니다.

```bash
# 1. 설치된 Java 버전 확인
java -version

# 2. JAVA_HOME 환경변수 설정 (AIX 표준 경로 예시: /usr/java11_64)
export JAVA_HOME=/usr/java11_64
export PATH=$JAVA_HOME/bin:$PATH
```


---

## **2. Agent 설치 절차**

대상 AIX 서버에 접속하여 다음 명령어를 순차적으로 실행합니다.

```bash
# 1. 설치 디렉토리 생성
mkdir -p {{ extra.agent.install_path }}

# 2. 설치 경로로 이동 및 압축 해제
cd {{ extra.agent.install_path }}
# AIX에서는 tar 명령어로 압축 해제 (파일명 확인 필수)
tar xvf {{ extra.agent.pkg_aix }}

# 3. 설치 스크립트 실행
# 형식: ./install.sh [설치경로] [포트] [HTTPS사용여부(기본값 true)]
./install.sh {{ extra.agent.install_path }} {{ extra.agent.port }}
```

---

## **3. 서비스 기동 및 확인**

AIX 환경에서는 `systemctl` 대신 패키지에 포함된 관리 스크립트를 직접 실행합니다.

```bash
# 1. Agent 서비스 기동 (Watchdog 포함)
{{ extra.agent.install_path }}/bin/watchdog_service.sh start

# 2. 프로세스 실행 여부 확인
ps -ef | grep [g]am_agent
```

**정상 가동 시 출력 예시:**
```bash
root  4587622        1  0 10:22:15  pts/0  0:00 /usr/java11_64/bin/java -jar /opt/gam_agent/gam_agent_watchdog.jar start
root  4587630  4587622  1 10:22:16  pts/0  0:02 /usr/java11_64/bin/java -jar /opt/gam_agent/gam_agent.jar start
```

---

## **4. 안정적인 연동을 위한 재시작**

!!! warning "주의 사항"
    수동 설치 직후에는 프로세스가 불안정할 수 있어 MDRM 서버에서의 '가져오기' 작업 시 일시적인 장애가 발생할 수 있습니다. 안전한 연동을 위해 다음 명령어로 Agent를 완전히 종료한 후 다시 기동할 것을 권장합니다.

```bash
# 1. 서비스 중지
{{ extra.agent.install_path }}/bin/watchdog_service.sh stop

# 2. 잔류 프로세스 강제 종료 (Unix/AIX 표준)
# ps로 gam_agent 관련 프로세스를 찾아 강제로 kill 합니다.
ps -ef | grep gam_agent | grep -v grep | awk '{print $2}' | xargs kill -9

# 3. 서비스 다시 시작
{{ extra.agent.install_path }}/bin/watchdog_service.sh start
```

---

## **5. 설치 확인 사항**

*   **포트 리스닝 확인**: 설정한 {{ extra.agent.port }} 포트가 정상적으로 Listen 상태인지 확인합니다.
    ```bash
    netstat -an | grep {{ extra.agent.port }} | grep LISTEN
    ```
*   **권한 확인**: 설치 경로의 파일들이 실행 권한(`chmod +x`)을 가지고 있는지 확인하십시오.

---

## **6. 설정 파일 비교: 수동 설치 vs 가져오기 후**

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
<a href="../MDRM_Agent_수동설치_리눅스/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🐧 수동설치 (Linux)</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
