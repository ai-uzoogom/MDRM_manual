# 🚨 운영-DR Node ID 불일치 해결 가이드

!!! info "문서 정보"
    이 문서는 **운영센터(Primary)의 서버 OS 이미지를 재해복구센터(DR)로 복제**하여 사용할 때 발생하는 **Node ID 불일치 문제**를 해결하기 위한 가이드입니다.
    
    *   **기준 버전**: MDRM v4.6.1.5 이상
    *   **관련 이슈**: 시스템 복제 후 워크플로우 오동작 (Node ID 불일치)

---

## **1. 문제 상황 및 원인**

### **1.1 현상**
운영센터에서 운영 중인 서버(OS 이미지)를 그대로 DR 센터로 복제하여 기동할 때, MDRM Agent가 DR 센터의 MDRM 서버와 정상적으로 통신하지 못하거나 워크플로우가 동작하지 않는 현상이 발생합니다.

### **1.2 원인 (Node ID 불일치)**
MDRM에서 각 시스템은 고유한 **Node ID**를 가집니다. 운영센터와 DR 센터가 물리적으로 분리된 MDRM 서버를 사용하는 경우, 동일한 서버라도 각 센터에서 부여받은 Node ID가 다를 수 있습니다.

| 센터 구분 | 서버명 | IP 주소 | 부여된 Node ID | 비고 |
|:---:|:---:|:---:|:---:|:---|
| **운영센터** | APP_SVR_01 | 10.10.10.1 | **N0059** | 원본 `config`에 저장된 값 |
| **DR 센터** | APP_SVR_01 | 20.20.20.1 | **N0063** | DR 센터 MDRM이 인식하는 값 |

*   **문제**: 운영센터의 설정 파일(`N0059`)이 그대로 복제되어 DR 센터에서 기동됨.
*   **결과**: DR 센터 MDRM은 해당 IP에 대해 `N0063`을 기대하지만, Agent는 `N0059`로 통신을 시도하여 인증 실패 또는 오동작 발생.

---

## **2. 해결 방법: API를 통한 Node ID 조회**

MDRM은 특정 IP 주소에 매핑된 올바른 Node ID를 조회할 수 있는 API를 제공합니다.

### **2.1 사전 준비: 인증 정보 인코딩**
API 호출을 위해 MDRM 사용자 아이디와 비밀번호를 **Base64**로 인코딩해야 합니다.

*   **형식**: `사용자ID:비밀번호`
*   **예시**: `mdrm_api:password` → `bWRybV9hcGk6cGFzc3dvcmQ=`

!!! tip "인코딩 방법"
    리눅스 터미널에서 다음 명령어로 쉽게 생성할 수 있습니다.
    `echo -n "mdrm_api:password" | base64`

### **2.2 API 호출 예시**

```bash
curl --location -k \
  https://{MDRM_SERVER}/services/get_node_id_by_ip?ip={NODE_IP} \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic {ENCODED_AUTH}'
```

*   `{MDRM_SERVER}`: 접속 대상 MDRM 서버 IP
*   `{NODE_IP}`: 조회하려는 대상 서버(Agent)의 IP
*   `{ENCODED_AUTH}`: 위에서 생성한 Base64 인증 문자열

---

## **3. 자동화: 기동 시 Node ID 자동 변경**

Agent가 기동될 때마다 자신의 IP에 맞는 올바른 Node ID를 조회하여 설정파일을 업데이트하도록 구성합니다.

### **3.1 동작 원리**
1.  Agent 설정 파일(`application.properties`)의 `agent.init.command` 옵션 사용.
2.  Agent 실행 직전, 지정된 스크립트(`Update-NodeId`)가 먼저 실행됨.
3.  스크립트가 MDRM API를 호출하여 올바른 Node ID를 가져와 설정을 갱신함.

### **3.2 리눅스 (Linux) 설정**

**1. 스크립트 배치**
`/opt/gam_agent/storage/scripts/Update-NodeId.sh`

**2. 설정 파일 수정 (`application.properties`)**
```properties
# 스크립트 경로와 자신의 IP를 인자로 전달
agent.init.command=/opt/gam_agent/storage/scripts/Update-NodeId.sh 10.20.33.103
```

### **3.3 윈도우 (Windows) 설정**

**1. 스크립트 배치**
`C:\Program Files\gam_agent\storage\scripts\Update-NodeId.ps1`

**2. 설정 파일 수정 (`application.properties`)**
```properties
# PowerShell 실행 권한 우회 옵션 포함
agent.init.command=powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\\Program Files\\gam_agent\\storage\\scripts\\Update-NodeId.ps1" 10.20.33.101
```

---

## **4. 참고용 스크립트 (예시)**

실제 사용 환경에 맞춰 API 주소와 인증 정보를 수정하여 사용하십시오.

??? example "Update-NodeId.sh (Linux 예시)"
    ```bash
    #!/bin/bash
    
    MY_IP=$1
    MDRM_IP="10.120.30.91"
    AUTH="bWRybV9hcGk6cGFzc3dvcmQ=" # Base64 Encoded (mdrm_api:password)
    CONFIG_FILE="/opt/gam_agent/application.properties"
    
    # 1. MDRM에서 올바른 Node ID 조회
    NEW_NODE_ID=$(curl -s -k -H "Authorization: Basic $AUTH" "https://$MDRM_IP/services/get_node_id_by_ip?ip=$MY_IP")
    
    # 2. Node ID가 유효한지 확인 (예: N으로 시작하는지)
    if [[ $NEW_NODE_ID == N* ]]; then
        echo "Updating Node ID to $NEW_NODE_ID"
        # 3. 설정 파일 갱신 using sed
        sed -i "s/^agent.agentId=.*/agent.agentId=$NEW_NODE_ID/" $CONFIG_FILE
    else
        echo "Failed to retrieve Node ID or invalid format: $NEW_NODE_ID"
    fi
    ```
