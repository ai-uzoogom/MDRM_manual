# 🚀 Agent 자동 설치

!!! info "학습 안내"
    MDRM 서버에서 원격으로 Agent를 일괄 배포하는 자동 설치 방식의 요구사항과 단계별 설정 절차를 학습합니다.

---

## **1. 요구사항** {: #requirements }

MDRM 서버를 통해 Agent를 자동으로 설치하기 위해서는 대상 서버의 운영체제(OS)별 사전 준비가 필요합니다.

![MDRM 통신 포트 구성도](../assets/images/day1/port.png){: width="100%" }

### **1.1 Linux & Unix 계열**

*   **원격 접속**: SSH를 통한 원격 접속이 가능해야 합니다.
*   **Python 설치**: Python 2.7 또는 Python 3.6~3.12 버전이 설치되어 있어야 합니다.
*   **계정 권한**: 접속 계정은 `sudo` 권한을 보유해야 합니다.

---

### **1.2 Windows 계열**

*   **WinRM 설정**: WinRM을 통한 원격 접속이 가능해야 합니다. 터미널(CMD)에서 아래 명령어를 순차적으로 실행하십시오.
    ```cmd
    winrm quickconfig -q
    winrm set winrm/config/winrs @{MaxMemoryPerShellMB="1024"}
    winrm set winrm/config @{MaxTimeoutms="1800000"}
    winrm set winrm/config/service @{AllowUnencrypted="true"}
    winrm set winrm/config/service/auth @{Basic="true"}
    ```
    *(Windows 2008 R2 이전 버전은 추가로 `winrm set winrm/config/Listener?Address=*+Transport=HTTP @{Port="5985"}` 실행 필요)*
*   **환경 구성**: .NET Framework 4.0 이상 및 PowerShell 3.0 이상이 필요합니다.
*   **핫픽스(Hotfix)**: PowerShell v3.0 환경에서는 WinRM 버그 패치를 위해 다음 스크립트를 실행하십시오.
    ```powershell
    $url="https://raw.githubusercontent.com/jborean93/ansible-windows/master/scripts/Install-WMF3Hotfix.ps1"
    $file = "$env:temp\Install-WMF3Hotfix.ps1"
    (New-Object System.Net.WebClient).DownloadFile($url, $file)
    powershell.exe -ExecutionPolicy ByPass -File $file -Verbose
    ```

---

### **1.3 관제 서버 FQDN 설정**

Agent는 관제 서버의 **FQDN(Fully Qualified Domain Name)** 정보를 통해 통신합니다.

*   **DNS 활용**: DNS 서버에 관제 서버의 IP와 FQDN을 등록합니다.
*   **hosts 파일 활용**: DNS 사용이 어려운 경우 각 대상 서버의 `hosts` 파일에 정보를 입력합니다.
    *   **파일 위치**:
        *   Windows: `C:\Windows\System32\drivers\etc\hosts`
        *   Linux: `/etc/hosts`
    *   **입력 예시**: `<IP 주소> <FQDN 명칭>` (예: `10.20.30.40 mdrm.mantech.co.kr`)

---

## **2. 설치 절차**

### **2.1 1단계: MDRM 웹 UI 접속**

1. MDRM 웹 콘솔에 로그인
2. **시스템 관리** 메뉴로 이동
3. **시스템 추가** 버튼 클릭

### **2.2 2단계: 서버 정보 입력**

다음 정보를 입력합니다:

| 항목 | 설명 | 예시 |
|:---|:---|:---|
| 호스트명 | 대상 서버의 호스트명 | `app-server-01` |
| IP 주소 | 대상 서버의 IP | `192.168.1.100` |
| SSH 포트 | SSH 접속 포트 | `22` (기본값) |
| 사용자명 | SSH 접속 계정 | `root` |
| 비밀번호 | SSH 접속 비밀번호 | `********` |

### **2.3 3단계: 설치 옵션 선택**

- **설치 경로**: 기본값 `/opt/gam_agent` 또는 `/opt/mdrm_agent`
- **자동 시작**: Agent 설치 후 자동 시작 여부
- **방화벽 설정**: 필요한 포트 자동 오픈 여부

### **2.4 4단계: 설치 실행**

1. **설치 시작** 버튼 클릭
2. 설치 진행 상황 모니터링
3. 설치 완료 확인

---

## **3. 설치 확인**

설치가 완료되면 다음을 확인합니다:

### **3.1 Agent 프로세스 확인**

```bash
# Agent 프로세스 확인
ps -ef | grep gam_agent

# Agent 상태 확인
systemctl status gam_agent
```

### **3.2 MDRM 웹 UI에서 확인**

1. **시스템 목록**에서 새로 추가된 서버 확인
2. 상태가 **"정상"** 또는 **"연결됨"**으로 표시되는지 확인
3. Heartbeat가 정상적으로 수신되는지 확인

---

## **4. 장점**

✅ **간편성**
- 웹 UI에서 클릭 몇 번으로 설치 완료
- 복잡한 명령어 입력 불필요

✅ **자동화**
- 설치부터 등록까지 자동 처리
- 설정 파일 자동 생성

✅ **일관성**
- 모든 서버에 동일한 방식으로 설치
- 설정 오류 최소화

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_Agent_수동설치_리눅스/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">📦 수동설치 (Linux/Windows)</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
