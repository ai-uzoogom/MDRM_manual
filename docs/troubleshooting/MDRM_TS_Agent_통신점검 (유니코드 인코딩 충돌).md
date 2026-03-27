# 📡 통신 상태 점검 가이드

!!! info "학습 안내"
    MDRM 서버와 Agent 간의 네트워크 및 서비스 응답 상태를 터미널(CLI) 명령어를 통해 직접 진단하는 방법을 학습합니다.

---

## **1. 개요**

UI상에서 '연결 테스트'가 실패하거나 417 오류가 발생할 때, 정확한 장애 지점(네트워크 단절, 서비스 미구동 등)을 파악하기 위해 `curl` 명령어를 활용한 직접 점검이 필요합니다.

---

## **2. MDRM 서버 → Agent 통신 확인**

MDRM 서버에 접속하여 관리 대상 서버(Agent)의 서비스 상태를 확인합니다.

### **① 기본 버전 확인**
Agent 서비스가 정상적으로 떠 있고 통신이 가능한지 가장 빠르게 확인하는 방법입니다.
```bash
# Agent 버전 정보 출력
curl -sk https://{Agent IP}:{{ extra.agent.port }}/version
1.3.0
```

### **② 상세 노드 정보 확인**
Agent의 노드 ID, IP 목록, OS 버전 등 상세 정보를 JSON 형식으로 확인합니다.
```bash
# 상세 정보 및 노드 식별 정보 출력 (| jq 사용 권장)
curl -sk https://{Agent IP}:{{ extra.agent.port }}/about/get_about_info | jq
```

**출력 예시 (JSON)**
```json
{
  "agentId": "N0001",
  "fqdn": "localhost",
  "ips": [
    "192.168.1.100",
    "182.19.0.1",
    "fe80:0:0:0:1262:e5ff:fe11:d6fa%eno1"
  ],
  "version": "1.3.0",
  "osVersion": "Linux",
  "architecture": "amd64",
  "homePath": "/opt/gam_agent",
  "buildDate": "2025-04-11 07:28",
  "oldExist": true
}
```

---

## **3. Agent 서버 → MDRM 서버 통신 확인**

Agent 서버에 접속하여 MDRM 메인 서버(웹 서버)로의 접근 가능 여부를 확인합니다.

### **① 웹 포트(443) 응답 확인**
MDRM 서버의 웹 서비스가 정상적으로 응답하는지 헤더 정보를 통해 확인합니다.
```bash
# 443(HTTPS) 포트 헤더 정보만 확인
curl -kI https://{MDRM 서버 IP}
```

**성공 시 출력 예시 (Header)**
```http
HTTP/1.1 200 
Server: nginx
Date: Tue, 03 Feb 2026 01:30:00 GMT
Content-Type: text/html;charset=UTF-8
Content-Length: 855
Connection: keep-alive
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
X-Frame-Options: SAMEORIGIN
```

---

<center>
    <p style="opacity: 0.5; font-size: 0.8rem;">
        ※ {MDRM 서버 IP}와 {Agent IP}를 실제 환경의 주소로 치환하여 사용하십시오.
    </p>
</center>

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_TS_Agent_417오류/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Troubleshooting 03</span>
        <span class="next-step-title">417 오류 및 Token 불일치</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
