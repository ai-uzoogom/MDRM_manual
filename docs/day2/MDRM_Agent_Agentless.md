# 🔌 Agentless 설정

!!! info "학습 안내"
    대상 시스템에 Agent를 설치하지 않고 표준 프로토콜(SSH, WinRM)을 활용하여 원격으로 시스템을 관리하고 모니터링하는 방법을 학습합니다.


---

## **1. 사용 시나리오**

다음과 같은 경우에 적합합니다:

- 🚫 Agent 설치가 불가능한 환경
- ⏱️ 임시로 시스템을 관리해야 하는 경우
- 🔒 보안 정책상 추가 프로그램 설치 제한
- 📊 간단한 모니터링만 필요한 경우
- 🖥️ 네트워크 장비 등 Agent 설치 불가 시스템

---

## **2. 지원 프로토콜**

### Linux/Unix 시스템

**SSH (Secure Shell)**

- 표준 SSH 프로토콜 사용
- 포트: 22 (기본값)
- 인증 방식: 비밀번호 또는 SSH 키

### Windows 시스템

**WinRM (Windows Remote Management)**

- Windows 원격 관리 프로토콜
- 포트: 5985 (HTTP), 5986 (HTTPS)
- 인증 방식: 사용자명/비밀번호

---

## **3. 설정 절차**

### Linux/Unix 시스템 설정

#### 1단계: SSH 접속 확인

```bash
# SSH 서비스 상태 확인
systemctl status sshd

# SSH 서비스 시작 (필요시)
systemctl start sshd
systemctl enable sshd
```

#### 2단계: 사용자 계정 준비

```bash
# 관리용 계정 생성 (선택사항)
useradd -m mdrm_admin
passwd mdrm_admin

# sudo 권한 부여
echo "mdrm_admin ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/mdrm_admin
```

#### 3단계: SSH 키 인증 설정 (권장)

```bash
# MDRM 서버에서 SSH 키 생성
ssh-keygen -t rsa -b 4096 -f ~/.ssh/mdrm_key

# 공개 키를 대상 서버에 복사
ssh-copy-id -i ~/.ssh/mdrm_key.pub mdrm_admin@192.168.1.100

# 접속 테스트
ssh -i ~/.ssh/mdrm_key mdrm_admin@192.168.1.100
```

#### 4단계: MDRM에 시스템 등록

1. MDRM 웹 콘솔 로그인
2. **시스템 관리** > **Agentless 시스템 추가**
3. 시스템 정보 입력:

| 항목 | 설명 | 예시 |
|:---|:---|:---|
| 호스트명 | 대상 서버 호스트명 | `web-server-01` |
| IP 주소 | 대상 서버 IP | `192.168.1.100` |
| 프로토콜 | 접속 프로토콜 | `SSH` |
| 포트 | 접속 포트 | `22` |
| 사용자명 | SSH 접속 계정 | `mdrm_admin` |
| 인증 방식 | 비밀번호 또는 SSH 키 | `SSH Key` |
| SSH 키 | 개인 키 내용 | (키 파일 내용) |

---

### Windows 시스템 설정

#### 1단계: WinRM 활성화

PowerShell을 관리자 권한으로 실행:

```powershell
# WinRM 서비스 활성화
Enable-PSRemoting -Force

# WinRM 서비스 상태 확인
Get-Service WinRM

# WinRM 리스너 확인
winrm enumerate winrm/config/listener
```

#### 2단계: 방화벽 설정

```powershell
# WinRM HTTP 포트 허용 (5985)
New-NetFirewallRule -Name "WinRM-HTTP" -DisplayName "WinRM HTTP" `
    -Enabled True -Direction Inbound -Protocol TCP -LocalPort 5985

# WinRM HTTPS 포트 허용 (5986)
New-NetFirewallRule -Name "WinRM-HTTPS" -DisplayName "WinRM HTTPS" `
    -Enabled True -Direction Inbound -Protocol TCP -LocalPort 5986
```

#### 3단계: 인증 설정

```powershell
# Basic 인증 활성화 (HTTP 사용 시)
Set-Item WSMan:\localhost\Service\Auth\Basic -Value $true

# 신뢰할 수 있는 호스트 추가
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "192.168.1.10" -Force
```

#### 4단계: MDRM에 시스템 등록

1. MDRM 웹 콘솔 로그인
2. **시스템 관리** > **Agentless 시스템 추가**
3. 시스템 정보 입력:

| 항목 | 설명 | 예시 |
|:---|:---|:---|
| 호스트명 | 대상 서버 호스트명 | `win-server-01` |
| IP 주소 | 대상 서버 IP | `192.168.1.101` |
| 프로토콜 | 접속 프로토콜 | `WinRM` |
| 포트 | 접속 포트 | `5985` (HTTP) |
| 사용자명 | Windows 관리자 계정 | `Administrator` |
| 비밀번호 | 계정 비밀번호 | `********` |
| HTTPS 사용 | HTTPS 사용 여부 | `No` (HTTP) |

---

## **4. 연결 테스트**

### Linux/Unix SSH 테스트

```bash
# 수동 SSH 접속 테스트
ssh -i ~/.ssh/mdrm_key mdrm_admin@192.168.1.100

# 명령어 실행 테스트
ssh -i ~/.ssh/mdrm_key mdrm_admin@192.168.1.100 "hostname"
ssh -i ~/.ssh/mdrm_key mdrm_admin@192.168.1.100 "df -h"
```

### Windows WinRM 테스트

```powershell
# WinRM 연결 테스트
Test-WSMan -ComputerName 192.168.1.101

# 원격 명령 실행 테스트
Invoke-Command -ComputerName 192.168.1.101 `
    -Credential (Get-Credential) `
    -ScriptBlock { Get-ComputerInfo }
```

---

## **5. 제약사항**

!!! warning "Agentless 제약사항"
    Agentless 방식은 Agent 방식에 비해 다음과 같은 제약이 있습니다:

### 기능 제약

❌ **실시간 모니터링 제한**
- 실시간 성능 모니터링 불가
- 주기적인 폴링 방식으로 동작

❌ **네트워크 부하**
- 매번 SSH/WinRM 연결 생성
- Agent 방식보다 네트워크 사용량 높음

❌ **응답 속도**
- 연결 설정 시간 필요
- Agent 방식보다 느린 응답

❌ **기능 제한**
- 일부 고급 기능 사용 불가
- 복잡한 작업 수행 어려움

### 보안 제약

🔒 **계정 관리**
- 계정 정보를 MDRM에 저장
- 계정 변경 시 일일이 업데이트 필요

🔒 **네트워크 노출**
- SSH/WinRM 포트 오픈 필요
- 방화벽 설정 필요

---

## **6. 모니터링 가능 항목**

### Linux/Unix 시스템

✅ **시스템 정보**
- CPU, 메모리, 디스크 사용량
- 네트워크 인터페이스 상태
- 프로세스 목록

✅ **로그 수집**
- 시스템 로그 조회
- 애플리케이션 로그 수집

✅ **명령 실행**
- 스크립트 실행
- 시스템 명령 수행

### Windows 시스템

✅ **시스템 정보**
- CPU, 메모리, 디스크 사용량
- 서비스 상태
- 이벤트 로그

✅ **PowerShell 실행**
- PowerShell 스크립트 실행
- WMI 쿼리 수행

---

## **7. 문제 해결 (Troubleshooting)**

### SSH 연결 실패

!!! danger "오류: SSH 연결 실패"
    **원인**: 방화벽 차단, 계정 정보 오류, SSH 서비스 미실행
    
    **해결방법**:
    
    ```bash
    # SSH 서비스 확인
    systemctl status sshd
    
    # 방화벽 확인
    firewall-cmd --list-ports
    firewall-cmd --add-port=22/tcp --permanent
    firewall-cmd --reload
    
    # 수동 접속 테스트
    ssh mdrm_admin@192.168.1.100
    ```

### WinRM 연결 실패

!!! danger "오류: WinRM 연결 실패"
    **원인**: WinRM 미활성화, 방화벽 차단, 인증 실패
    
    **해결방법**:
    
    ```powershell
    # WinRM 서비스 확인
    Get-Service WinRM
    
    # WinRM 리스너 확인
    winrm enumerate winrm/config/listener
    
    # 방화벽 규칙 확인
    Get-NetFirewallRule -Name "WinRM*"
    
    # 연결 테스트
    Test-WSMan -ComputerName 192.168.1.101
    ```

### 권한 부족 오류

!!! danger "오류: 명령 실행 권한 없음"
    **원인**: 계정 권한 부족
    
    **해결방법**:
    
    ```bash
    # Linux: sudo 권한 확인
    sudo -l
    
    # sudo 권한 부여
    echo "mdrm_admin ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/mdrm_admin
    ```
    
    ```powershell
    # Windows: 관리자 권한 확인
    whoami /groups
    
    # 관리자 그룹에 추가
    net localgroup Administrators mdrm_admin /add
    ```

---

## **8. 보안 권장사항**

!!! tip "보안 강화 방법"
    
    ✅ **SSH 키 인증 사용**
    - 비밀번호 대신 SSH 키 사용
    - 키 파일 권한 엄격히 관리
    
    ✅ **전용 계정 사용**
    - MDRM 전용 계정 생성
    - 최소 권한 원칙 적용
    
    ✅ **방화벽 설정**
    - MDRM 서버 IP만 허용
    - 불필요한 포트 차단
    
    ✅ **로그 모니터링**
    - SSH/WinRM 접속 로그 모니터링
    - 비정상 접속 탐지

---

## **9. 장점 및 단점**

### 장점

✅ **간편성**
- Agent 설치 불필요
- 빠른 설정 가능

✅ **호환성**
- 표준 프로토콜 사용
- 대부분의 시스템 지원

### 단점

❌ **성능**
- Agent 방식보다 느림
- 네트워크 부하 높음

❌ **기능 제한**
- 실시간 모니터링 불가
- 일부 기능 사용 제한

❌ **관리 부담**
- 계정 정보 관리 필요
- 계정 변경 시 업데이트 필요

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_Agent_환경_설정/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">⚙️ Agent 환경 설정 가이드</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
