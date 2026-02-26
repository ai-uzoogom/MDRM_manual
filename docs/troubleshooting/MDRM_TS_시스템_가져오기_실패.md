# 📂 시스템 가져오기 사전점검 실패

!!! info "장애 조치 안내"
    MDRM 웹 콘솔에서 [시스템 가져오기] 기능을 통해 서버를 대량 등록할 때, 네트워크 보안 정책으로 인해 Ping 사전 점검(Precheck)이 차단되어 대상 서버 등록이 모두 실패하는 경우를 해결하는 방법을 학습합니다.

---

## **1. 장애 원인**

MDRM 서버는 [가져오기] 기능을 수행할 때 에이전트 통신 전에 대상 서버에 대한 기본적인 네트워크 연결을 확인하기 위해 **Ping (ICMP) 테스트**를 먼저 수행합니다. 
사내 방화벽이나 대상 서버의 인바운드 규칙에서 Ping을 차단하고 있다면, 실제 통신(에이전트 포트 등)이 가능하더라도 **"사전 점검 실패"**로 간주하여 등록 절차를 중단하게 됩니다.

---

## **2. 해결 방법: 사전 점검(Ping) 옵션 비활성화**

이 경우, MDRM 서버의 설정 파일에서 Ping 테스트 수행 로직 자체를 건너뛰도록(Skip) 설정해야 합니다.

### **2.1 설정 파일 편집**

MDRM 서버로 SSH 접속 후, 백엔드 환경 설정 파일인 `wind-config.properties`를 엽니다.

```bash
# 설정 파일 열기
vi /mdrm/data/config/wind-config.properties
```

### **2.2 코드 블록 추가**

파일 내부에 아래의 코드를 추가하거나, 기존 항목이 있다면 `false`로 값을 변경합니다.

```
wind.ansible.ping.precheck = false
```

!!! tip "코드 설명"
    `wind.ansible.ping.precheck` 값을 `false`로 주면, 시스템 가져오기 과정에서 무의미한 Ping 점검 단계를 생략하고 즉시 시스템을 DB에 등록합니다.

---

## **3. 적용 시스템 재시작**

설정값을 저장한 후에는 전체 MDRM 시스템을 재기동하여 설정을 반영해야 합니다.

```bash
# Docker Compose 디렉토리로 이동
cd /mdrm/data/bin

# 전체 시스템(MDRM) 재기동
docker compose down
docker compose up -d
```

재시작이 완료되면 웹 콘솔에서 가져오기 작업을 다시 시도하시기 바랍니다.

---

<div class="next-step-card-container" markdown>
<a href="../../advanced/MDRM_포트_변경_가이드/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Troubleshooting 06</span>
        <span class="next-step-title">Agent 포트({{ extra.agent.port }}) 변경 가이드</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
