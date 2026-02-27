# ⚡ 자동화 구현 시 주요 체크포인트

!!! info "학습 안내"
    MDRM을 이용해 시스템 자동화 스크립트를 구현할 때 빈번하게 발생하는 이슈들과 이를 예방하기 위한 모범 사례(Best Practices)를 학습합니다. 안정적인 자동 전환을 위해 반드시 고려해야 할 사항들입니다.

## **1. 프로세스 상태 점검 로직 (Process Check Logic)**

자동화 스크립트 작성 시 가장 흔하게 겪는 문제는 **"스크립트상으로는 기동 성공으로 나오지만, 실제로는 프로세스가 죽어있는 경우"**입니다.

### **현상: 유령 프로세스 (Zombie/Ghost Process)**
*   스크립트가 실행되는 순간에는 프로세스가 생성되어 `PID`가 존재합니다.
*   하지만 어플리케이션이 초기화되는 과정(예: DB 연결 접속 시도)에서 오류가 발생하여, 몇 초 뒤에 조용히 종료되는 경우가 있습니다.
*   단순히 `ps -ef | grep 프로세스명`으로만 성공 여부를 판단하면, **MDRM은 "성공"으로 인식하고 다음 단계로 넘어가지만 실제 서비스는 중단된 상태**가 됩니다.

### **해결 방안**
*   **2단 검증**: 기동 명령 실행 직후 1차 확인을 하고, 약 5~10초의 `sleep` 시간을 둔 뒤 **2차 확인**을 수행하는 로직을 구현합니다.
*   **로그 모니터링**: 가능하다면 기동 스크립트 내에서 어플리케이션 로그의 특정 문자열(예: `Server startup in ... ms`)을 확인하도록 합니다.

## **2. 프로세스 간 기동 순서 및 대기 시간 (Timing Issue)**

여러 프로세스가 순서대로 기동되어야 하는 환경(예: JEUS → WebtoB, 또는 DB → WAS)에서는 **"텀(Term)"** 조절이 핵심입니다.

### **현상: 의존성 실패**
*   1번 프로세스(예: DB)를 기동시키는 명령을 보내고, 바로 2번 프로세스(예: WAS) 기동 명령을 보냅니다.
*   1번 프로세스가 완전히 서비스를 제공할 준비(Port Listen 등)가 되기 전에 2번 프로세스가 접속을 시도하여 **Connection Refused** 오류로 기동에 실패합니다.

### **해결 방안**
*   **충분한 대기 시간**: 선행 프로세스 기동 후 후행 프로세스 시작 사이에 넉넉한 `sleep`을 부여합니다.
*   **포트 오픈 확인**: 단순 시간 대기보다는, 선행 프로세스의 서비스 포트가 실제로 열렸는지(`netstat`, `telnet`, `nc` 등 활용) 확인하는 로직을 추가하는 것이 가장 확실합니다.

## **3. SSH 기반 제어 시 필수 옵션 (SSH Automation)**

AIX 시스템 제어나 스토리지 관리를 위해 `sshpass` 등을 이용하여 원격 명령을 수행할 때, 보안 확인 절차로 인해 자동화가 멈추는 경우가 있습니다.

### **현상: Host Key 확인 프롬프트**
*   스크립트가 처음 접속하는 대상이거나, 대상 서버의 IP/Key가 변경된 경우 SSH 클라이언트는 `Are you sure you want to continue connecting (yes/no)?` 라는 프롬프트를 띄우고 대기합니다.
*   자동화 스크립트는 이에 대답할 수 없으므로 무한 대기 상태에 빠지거나 타임아웃으로 실패합니다.

### **해결 방안: 무시 옵션 추가**
SSH 명령 사용 시 다음 두 가지 옵션을 반드시 포함하여, 호스트 키 검증을 건너뛰도록 설정합니다.

```bash
sshpass -p "비밀번호" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null 사용자@호스트IP "명령어"
```

*   **`-o StrictHostKeyChecking=no`**: 호스트 키가 알려지지 않은 경우에도 물어보지 않고 자동으로 호스트 목록에 추가(혹은 무시)하고 접속합니다.
*   **`-o UserKnownHostsFile=/dev/null`**: 호스트 키를 `known_hosts` 파일에 저장하지 않고 버립니다. (키 변경 시 충돌 방지)

<div class="next-step-card-container" markdown>
<a href="../MDRM_실전_시나리오_실습/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">실전 시나리오 실습</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
