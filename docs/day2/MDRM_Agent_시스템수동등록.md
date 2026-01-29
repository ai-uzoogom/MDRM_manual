# 시스템 수동등록

!!! tip "설치 방식 요약"
    재해복구(DR) 환경에서 운영 서버의 OS 영역이 스토리지 복제 방식으로 구성되어 넘어오는 특수한 경우에 사용합니다. OS 이미지가 그대로 복제되어 별도의 Agent 등록 과정을 수행할 수 없는 환경에서 Agent 구성 정보를 수동으로 매핑할 때 적합합니다.

!!! danger "특수상황 전용"
    이 방법은 매우 특수한 상황에서만 사용합니다. 일반적인 경우에는 자동설치나 수동설치를 사용하세요.

---

## 사용 시나리오

다음과 같은 **매우 특수한** 경우에만 사용합니다:

- 💾 Storage 복제로 OS 이미지가 그대로 복사되는 환경
- 🏢 백업센터와 운영센터가 물리적으로 분리된 환경
- 🔌 백업센터의 MDRM과 운영센터 간 통신 불가능
- 🚫 시스템 가져오기로 등록이 불가능한 경우

### 실제 사례

```
백업센터 (MDRM-A)          운영센터 (MDRM-B)
    ↓                          ↓
[서버 + Agent]  ─복제→  [서버 + Agent]
    ↓                          ↓
Storage 복제로              동일한 Agent가
OS 이미지 복사              설치되어 있음
```

---

## 설치 절차

### 1단계: 백업센터에서 NodeID 생성

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

### 2단계: 운영센터에 Agent 수동설치

운영센터 서버에 Agent를 수동으로 설치합니다.

```bash
# root 계정으로 로그인
sudo su -

# 설치 파일 전송 및 압축 해제
cd /tmp
tar -xzf gam_agent_installer.tar.gz

# 설치 실행
cd gam_agent_installer
./install.sh

# 설치 경로 확인
ls -l /opt/gam_agent
```

### 3단계: NodeID 매핑 (가장 중요)

!!! danger "⚠️ 가장 중요한 단계"
    이 단계를 정확하게 수행하지 않으면 시스템이 정상적으로 동작하지 않습니다!

환경설정 파일에 백업센터에서 생성한 NodeID를 매핑합니다.

```bash
# 설정 파일 편집
vi /opt/gam_agent/config/application.properties
```

다음 항목을 수정합니다:

```properties
# NodeID 설정 (백업센터에서 생성한 ID)
agent.agentId=N0001

# 운영센터 MDRM 서버 정보
mdrm.server.ip=192.168.2.10
mdrm.server.port=8080
mdrm.server.https=false

# Agent 포트
server.port=20080
```

### 4단계: Agent 시작

```bash
# Agent 시작
cd /opt/gam_agent
./bin/start.sh

# 프로세스 확인
ps -ef | grep gam_agent

# 로그 확인
tail -f logs/agent.log
```

### 5단계: 운영센터 Agent 종료 로직 추가

운영센터에서는 백업센터로 복제될 때 Agent가 자동으로 종료되도록 설정합니다.

```bash
# 종료 스크립트 생성
vi /opt/gam_agent/bin/stop_on_backup.sh
```

```bash
#!/bin/bash
# 백업 복제 시 Agent 종료 스크립트

# Agent 프로세스 확인
if ps -ef | grep gam_agent | grep -v grep > /dev/null; then
    echo "Stopping Agent for backup replication..."
    /opt/gam_agent/bin/stop.sh
    echo "Agent stopped successfully"
else
    echo "Agent is not running"
fi
```

```bash
# 실행 권한 부여
chmod +x /opt/gam_agent/bin/stop_on_backup.sh
```

---

## NodeID 매핑 확인

NodeID가 올바르게 설정되었는지 확인합니다.

### 설정 파일 확인

```bash
# NodeID 확인
grep "agent.agentId" /opt/gam_agent/config/application.properties

# 출력 예시
# agent.agentId=N0001
```

### 로그에서 확인

```bash
# Agent 로그에서 NodeID 확인
grep "agentId" /opt/gam_agent/logs/agent.log

# 출력 예시
# [INFO] Agent started with NodeID: N0001
```

### MDRM 웹 UI에서 확인

1. 운영센터 MDRM 웹 콘솔 로그인
2. **시스템 목록**에서 NodeID `N0001` 검색
3. 서버 정보 및 상태 확인

---

## 복제 프로세스

### 백업센터 → 운영센터 복제 시

1. **복제 전**: 운영센터 Agent 종료
   ```bash
   /opt/gam_agent/bin/stop_on_backup.sh
   ```

2. **Storage 복제 수행**
   - OS 이미지 전체 복제
   - Agent 설정 파일 포함

3. **복제 후**: 운영센터 Agent 시작
   ```bash
   /opt/gam_agent/bin/start.sh
   ```

4. **확인**: NodeID가 유지되는지 확인
   ```bash
   grep "agent.agentId" /opt/gam_agent/config/application.properties
   ```

---

## 문제 해결

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

### 복제 후 Agent 시작 실패

!!! danger "오류: 복제 후 Agent가 시작되지 않음"
    **원인**: 네트워크 설정 변경, 설정 파일 손상
    
    **해결방법**:
    
    ```bash
    # 네트워크 설정 확인
    ip addr show
    
    # MDRM 서버 연결 테스트
    telnet 192.168.2.10 8080
    
    # 설정 파일 확인
    cat /opt/gam_agent/config/application.properties
    
    # Agent 재시작
    /opt/gam_agent/bin/restart.sh
    ```

---

## 주의사항

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

## 장점 및 단점

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

<a href="../MDRM_Agent_Agentless/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">Agentless 설정</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
