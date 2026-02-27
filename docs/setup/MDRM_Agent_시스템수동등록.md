# 🛠️ 시스템 수동 등록

!!! info "학습 안내"
    재해복구(DR) 환경과 같이 OS 이미지가 스토리지 복제 방식으로 전송되어 별도의 등록 과정을 수행할 수 없는 특수 환경에서의 Agent 구성 정보 매핑 절차를 학습합니다.

!!! tip "관련 심화 학습"
    대량의 시스템을 CSV 파일을 통해 일괄 등록해야 하는 경우, MDRM 서버에서 **System Loader** 도구를 사용할 수 있습니다.
    
    *   [🛠️ 시스템 대량 수동 등록 (System Loader) 가이드](../advanced/MDRM_시스템_수동등록_Loader.md)


---

## **1. 사용 시나리오**

다음과 같은 **매우 특수한** 경우에만 사용합니다:

- 💾 Storage 복제로 OS 이미지가 그대로 복사되는 환경
- 🏢 백업센터와 운영센터가 물리적으로 분리된 환경
- 🔌 백업센터의 MDRM과 운영센터 간 통신 불가능
- 🚫 시스템 가져오기로 등록이 불가능한 경우

<iframe src="../../assets/diagrams/dr_architecture.html" width="100%" height="500px" scrolling="no" style="border:none; overflow:hidden; margin-top: -20px;"></iframe>


---

## **2. 설치 절차**

### **2.1 1단계: 백업센터에서 NodeID 생성**

백업센터의 MDRM에서 가상의 시스템을 등록하여 NodeID를 미리 부여받습니다.

1. 백업센터 MDRM 웹 콘솔 로그인
2. **시스템 관리** > **시스템 추가** 선택
3. 운영센터에 배포될 서버 정보 입력:
   - 호스트명: `prod-app-server-01`
   - IP 주소: 운영센터 IP (예정)
   - 기타 정보
4. **NodeID 확인 및 기록**: 예) `N0001`

!!! warning "NodeID 기록 필수"
    생성된 NodeID를 반드시 기록해두세요. 이후 단계에서 필수적으로 사용됩니다.

### **2.2 2단계: 운영센터에 Agent 수동설치**

운영센터 서버에 Agent를 수동으로 설치합니다.

```bash
# root 계정으로 로그인
sudo su -

# 설치 파일 전송 및 압축 해제
cd /tmp
tar zxvf {{ extra.agent.pkg_linux }}

# 설치 실행
cd {{ extra.agent.install_path }}
./install.sh {{ extra.agent.install_path }} {{ extra.agent.port }}

```

### **2.3 3단계: NodeID 매핑 (가장 중요)**

!!! danger "⚠️ 가장 중요한 단계"
    이 단계를 정확하게 수행하지 않으면 시스템이 정상적으로 동작하지 않습니다!

환경설정 파일에 백업센터에서 생성한 NodeID를 매핑합니다.

```bash
# 설정 파일 편집
vi {{ extra.agent.install_path }}/application.properties
```

다음 항목을 수정합니다:

```properties
# NodeID 설정 (백업센터에서 생성한 ID)
agent.agentId=N0001
agent.heartbeat=10000
agent.https.enabled=true
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

### **2.4 4단계: Agent 시작**

```bash
# Agent 시작
systemctl start gam_agent

# 프로세스 확인
ps -ef | grep [g]am_agent

# 로그 확인
tail -f {{ extra.agent.install_path }}/logs/gam_agent.log

```

### **2.5 5단계: 운영센터 Agent 종료 로직 추가**

운영센터에서는 백업센터로 복제될 때 Agent가 자동으로 종료되도록 설정합니다.

```bash
# 스크립트 디렉토리 생성
mkdir -p {{ extra.agent.install_path }}/storage/scripts

# 종료 스크립트 생성
vi {{ extra.agent.install_path }}/storage/scripts/dr_zone_check_ping.sh 

```

```bash
#!/bin/bash
# DR Zone 감지 및 Agent 자동 종료 스크립트

# 1. 설정 변수
PROP_FILE="{{ extra.agent.install_path }}/application.properties"
MDRM_IP=$(grep "mdrm.server.ip" $PROP_FILE | cut -d'=' -f2)
MAX_CHECK=3       # 최대 체크 횟수
PING_COUNT=5      # 1회 체크 당 Ping 횟수

# 2. 네트워크 연결 확인 루프 (3회 시도)
for (( i=1; i<=MAX_CHECK; i++ ))
do
    echo "[Check $i/$MAX_CHECK] Pinging MDRM ($MDRM_IP)..."
    
    # Ping 5회 테스트
    # -c: 횟수, -W: 타임아웃(초)
    ping -c $PING_COUNT -W 1 $MDRM_IP > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "MDRM Connection OK. Agent is safe."
        exit 0
    fi
    
    echo "Ping failed. Retrying in 2 seconds..."
    sleep 2
done

# 3. 모든 시도 실패 시 Agent 종료
echo "CRITICAL: MDRM is unreachable after $MAX_CHECK attempts."
echo "Determined NOT in DR Zone. Stopping Agent..."

systemctl stop gam_agent
```

```bash
# 실행 권한 부여
chmod +x {{ extra.agent.install_path }}/storage/scripts/dr_zone_check_ping.sh 
```

---

## **3. NodeID 매핑 확인**

NodeID가 올바르게 설정되었는지 확인합니다.

### **3.1 설정 파일 확인**

```bash
# NodeID 확인
grep "agent.agentId" {{ extra.agent.install_path }}/config/application.properties

# 출력 예시
# agent.agentId=N0001
```

### **3.2 로그에서 확인**

```bash
# Agent 로그에서 NodeID 확인
grep "agentId" /opt/gam_agent/logs/agent.log

# 출력 예시
# [INFO] Agent started with NodeID: N0001
```

### **3.3 MDRM 웹 UI에서 확인**

1. 운영센터 MDRM 웹 콘솔 로그인
2. **시스템 목록**에서 NodeID `N0001` 검색
3. 서버 정보 및 상태 확인

---

## **4. 문제 해결 (Troubleshooting)**

### NodeID 불일치

!!! danger "오류: NodeID가 일치하지 않음"
    **증상**: MDRM에서 시스템을 인식하지 못함
    
    **원인**: NodeID 매핑이 잘못됨
    
    **해결방법**:
    
    1. 설정 파일에서 NodeID 재확인
    2. 백업센터에서 생성한 NodeID와 비교
    3. 올바른 NodeID로 수정 후 Agent 재시작

### Agent가 두 곳에서 동시 실행

!!! danger "오류: 동일한 NodeID로 여러 Agent 실행"
    **증상**: MDRM에서 시스템 상태가 불안정
    
    **원인**: 백업센터와 운영센터에서 동일한 NodeID의 Agent가 동시 실행
    
    **해결방법**:
    
    1. 백업센터 Agent 종료
    2. 운영센터 Agent만 실행 유지
    3. 복제 프로세스 재검토
    
---

## **5. 주의사항**

!!! warning "반드시 확인해야 할 사항"
    
    ✅ **NodeID 매핑**
    - 백업센터에서 생성한 NodeID를 정확히 기록
    - 운영센터 설정 파일에 정확히 입력
    
    ✅ **Agent 중복 실행 방지**
    - 백업센터와 운영센터에서 동시 실행 금지
    - 복제 전 반드시 한쪽 Agent 종료
    
    ✅ **MDRM 서버 정보**
    - 운영센터 MDRM 서버 IP 정확히 설정
    - 네트워크 연결 가능 여부 확인
    
    ✅ **복제 프로세스 문서화**
    - 복제 절차를 명확히 문서화
    - 담당자 간 공유 필수

---

## **6. 장점 및 단점**

### 장점

✅ **Storage 복제 환경 지원**
- OS 이미지 복제 환경에서 사용 가능
- 백업센터와 운영센터 분리 관리

### 단점

❌ **복잡성**
- 설정 과정이 매우 복잡
- NodeID 매핑 오류 시 심각한 문제 발생

❌ **관리 부담**
- 수동 관리 필요
- 복제 프로세스 추가 작업 필요

❌ **오류 가능성**
- 설정 오류 가능성 높음
- 문제 발생 시 해결 어려움

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_Agent_Agentless/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🔌 Agentless 설정 가이드</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
