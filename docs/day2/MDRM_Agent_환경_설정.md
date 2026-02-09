# ⚙️ Agent 환경 설정

!!! info "학습 안내"
    MDRM Agent의 핵심 설정 파일인 `application.properties`의 주요 항목들을 예시를 통해 학습합니다.

---

## **1. 주요 설정 예시 (application.properties)**

```properties
# NodeID 설정 (백업센터에서 생성한 ID)
agent.agentId=N0001
agent.heartbeat=10000
agent.https.enabled=true
# 유닉스/리눅스용 권한 실행 설정
agent.server.runas_command=su - {user} -c {command}
agent.service.script=./bin/unix_service.sh
agent.temp.path=./storage
logging.config=logback.xml

mdrm.debug.mode=false
mdrm.logstash.port=5001
mdrm.server.https=true
mdrm.server.ip={{ extra.mdrm.server_ip }}
mdrm.server.port={{ extra.mdrm.server_port }}

server.port={{ extra.agent.port }}
server.ssl.key-store-password=password
server.ssl.key-store=keystore.pfx
server.ssl.keyAlias=gam_agent
server.server-header=MDRM_AGENT
spring.profiles.active=prod

# DR ZONE CHECK
# DR센터 내에서만 Agent를 기동하고 아니면 종료시키는 스크립트
agent.init.command=./storage/scripts/dr_zone_check_ping.sh
```

---

## **2. 주요 항목 설명**

### **2.1 `agent.agentId`**
MDRM 서버에서 해당 시스템을 식별하기 위한 고유 ID입니다. 수동 등록 시 서버에서 제공하는 ID와 반드시 일치해야 합니다.

### **2.2 `agent.server.runas_command` (유닉스/리눅스 전용)**
특정 작업(컴포넌트 실행 등) 시 Agent가 root가 아닌 일반 사용자 계정 권한으로 명령을 수행해야 할 때 사용하는 명령어 템플릿입니다. 이 설정은 유닉스 및 리눅스 계열 서버에만 적용됩니다.

### **2.3 `server.server-header`**
HTTP 응답 헤더의 서버 정보를 위조하거나 숨기기 위한 보안 옵션입니다. 보안상의 이유로 설정하지만, 필수 항목은 아닙니다.

### **2.4 `agent.init.command`**
Agent 서비스가 시작될 때 딱 **1회**만 실행되는 초기화 명령어입니다. 

!!! tip "실무 활용 예시: DR ZONE CHECK"
    예시의 `dr_zone_check_ping.sh`는 DR 센터 환경에서 운영 서버의 생존 여부를 확인하여, 운영 서버가 가동 중인 경우 DR 서버의 에이전트가 자동 종료되도록 로직을 구성할 때 활용됩니다.

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_메뉴_대시보드/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">📊 MDRM 메뉴: 대시보드</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
