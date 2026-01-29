# 🐧 에이전트 수동설치 (Linux)

!!! tip "설치 방식 요약"
    보안 정책상 SSH root 접속이 불가능하거나 네트워크가 분리된 환경(DMZ 등)에서 사용하는 방식입니다. 프라이빗 네트워크 환경의 고객사에서 가장 많이 사용되며, 서비스 통신을 위한 443 및 20080 포트만 허용되면 가능합니다.

---

## 1. 에이전트 설치 절차

대상 서버에 접속하여 다음 명령어를 순차적으로 실행합니다.

```bash
# 1. 설치 디렉토리 생성
mkdir -p /opt/gam_agent

# 2. 설치 경로로 이동 및 압축 해제
cd /opt/gam_agent
tar zxvf gam_agent.withJreX64.tar.gz

# 3. 설치 스크립트 실행
# 형식: ./install.sh [설치경로] [포트] [HTTPS사용여부(기본값 true)]
./install.sh /opt/gam_agent 20080
```

---

## 2. 설치 및 가동 확인

설치가 완료되면 에이전트는 기본적으로 자동으로 가동됩니다. 다음 명령어로 프로세스 상태를 확인합니다.

```bash
ps -ef | grep [g]am_agent
```

**정상 가동 시 출력 예시:**
```bash
root 14995 /opt/gam_agent/jre/bin/java -jar /opt/gam_agent/gam_agent_watchdog.jar start
root 15010 /opt/gam_agent/jre/bin/java -jar /opt/gam_agent/gam_agent.jar start
```

### 주요 프로세스 설명
- **`gam_agent.jar`**: 에이전트 서비스의 핵심 주체입니다.
- **`gam_agent_watchdog.jar`**: 에이전트 프로세스의 생존 여부를 감시하고 장애 시 자동으로 재기동합니다.

---

## 3. 안정적인 연동을 위한 재시작

!!! warning "주의 사항"
    수동 설치 직후에는 프로세스가 불안정할 수 있어 MDRM 서버에서의 '가져오기' 작업 시 일시적인 장애가 발생할 수 있습니다. 안전한 연동을 위해 다음 명령어로 에이전트를 완전히 재시작할 것을 권장합니다.

```bash
# 1. 서비스 중지 및 잔류 프로세스 제거
systemctl stop gam_agent
pkill -ecf gam_agent

# 2. 서비스 시작
systemctl start gam_agent

# 3. 리스닝 포트 확인 (20080)
ss -antpl | grep 20080
```

---

<a href="MDRM_Agent_수동설치_가져오기.md" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">📥 에이전트 가져오기</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
