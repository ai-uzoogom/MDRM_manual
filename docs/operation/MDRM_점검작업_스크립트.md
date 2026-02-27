# 🔍 점검작업 스크립트

!!! info "학습 안내"
    MDRM 점검작업(Inspection)의 핵심인 **'결과 파싱(Parsing)'** 메커니즘을 이해하고, 제공된 실무 PowerShell 샘플 스크립트를 활용하여 고급 점검 컴포넌트를 구축하는 방법을 학습합니다.

---

## **1. 점검 결과 출력 가이드**

일반 워크플로우와 달리, **점검작업** 메뉴에서 결과와 이력을 체계적으로 관리하기 위해서는 스크립트 마지막에 반드시 MDRM이 이해할 수 있는 특정 형식의 출력을 포함해야 합니다.

**점검 결과 표준 출력 형식**
```powershell
# 기본 형식: {% raw %}{{ 상태 || 코멘트 || 상세로그 }}{% endraw %}
# 최종 출력되는 echo 값을 통해 "준수/미준수/실패"를 구분합니다.
Write-Output "{% raw %}{{ OK || 점검값 정상 || 모든 프로세스가 기동 중입니다. }}{% endraw %}"
```

| 구분 항목 | 설명 | UI 반영 위치 |
| :--- | :--- | :--- |
| **상태 (State)** | `OK` (준수), `CRITICAL` (미준수), `FAIL` (실패) | 준수/미준수/실패 처리 여부 |
| **코멘트 (Comment)** | 점검 결과에 대한 짧은 요약 문구 | 점검작업 결과 내용 |
| **상세로그 (Detail)** | 명령어 결과 전문 등 상세 정보 | **결과 상세정보** 팝업 패널 |

!!! warning "리포트 포함 여부"
    세 번째 항목인 **'결과 상세정보'는 엑셀 등의 결과 리포트에는 포함되지 않으며**, 오직 콘솔의 결과 상세 팝업 패널에서만 확인 가능합니다.


### **1.1 점검 결과 상태 코드**

작업의 최근 실행 결과를 상태별로 표시합니다. 상태별 설명은 다음과 같습니다.

| 상태 | 설명 |
| :--- | :--- |
| **미준수** | 작업 실행 시 대상 시스템에 작업 명령(점검항목별 스크립트)을 수행 후 반환되는 문자열이 "CRITICAL"인 상태 |
| **실패** | 작업 실행 시 통신 불가 등의 이유로 대상 시스템에 작업 명령(점검항목별 스크립트)을 수행할 수 없는 상태 |
| **준수** | 작업 실행 시 대상 시스템에 작업 명령(점검항목별 스크립트)을 수행 후 반환되는 문자열이 "OK"인 상태 |

---

## **2. OS별 명령어 결과 포함 방법**

단순한 텍스트가 아니라 실제 명령어의 결과값(Output)을 상세로그에 포함하고 싶을 경우, OS별로 아래와 같은 형식을 사용합니다.

### **2.1 Linux/Unix (Backtick 활용)**
내용 안에 **역따옴표(`` ` ``)**를 사용하여 명령어 결과값을 한 줄로 출력할 수 있습니다.
```bash
# 예시: 프로세스 리스트 결과를 상세로그에 바로 포함
echo "{% raw %}{{ OK || [ gam_agent ] process is running || `ps -ef | grep gam_agent` }}{% endraw %}"
```

### **2.2 Windows (나누어 출력하기)**
Windows에서는 파이프(`|`) 기호를 이스케이프(`^`) 처리하여 시작 블록을 출력한 뒤, 실행할 명령어를 입력하고 마지막에 닫는 블록(`}}`)을 출력합니다.
```cmd
# 예시: 서비스 상태 쿼리 결과를 상세로그에 포함
echo {% raw %}{{ OK ^|^| [gam_agent] process is running ^|^|{% endraw %}
sc query gam_agent
echo {% raw %}}}{% endraw %}
```

---

## **3. 실무 사례 1: 불필요 파일 탐지 점검**


보안 가이드라인에 따라 서버 내에 존재해서는 안 되는 파일(예: 개인정보가 포함될 수 있는 Office 파일)을 탐지하는 컴포넌트 예시입니다.

**Office 파일 존재 여부 체크 (PowerShell)**
```powershell
# 1. 대상 확장자 및 경로 설정
$Extensions = @("*.xls", "*.xlsx", "*.ppt", "*.pptx")
$TargetDir = "C:\Data"

# 2. 파일 검색 및 카운트
$files = Get-ChildItem -Path $TargetDir -Include $Extensions -Recurse -File
$fileCount = $files.Count

# 3. 결과에 따른 상태 정의
if ($fileCount -gt 0) {
    $state = "CRITICAL"
    $comment = "Office 파일 $fileCount건 탐지됨"
    $log = "탐지된 파일: " + ($files.FullName -join ", ")
} else {
    $state = "OK"
    $comment = "Office 파일 없음 (안전)"
    $log = "스캔 결과 깨끗합니다."
}

# 4. MDRM 표준 형식으로 출력
Write-Output "{% raw %}{{ $state || $comment || $log }}{% endraw %}"
```

---

## **3. 실무 사례 2: 보안 취약 포트 점검**

서버에서 외부로 노출되면 위험한 특정 포트(예: RDP 3389, SMB 445 등)가 활성화되어 있는지 실시간으로 점검합니다.

**취약 포트 Listen 상태 체크 (PowerShell)**
```powershell
# 1. 점검할 핵심 포트 목록
$TargetPorts = @(135, 445, 3389)
$foundVulnerable = $false

# 2. 포트 상태 순회
foreach ($port in $TargetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
    if ($conns) { $foundVulnerable = $true }
}

# 3. 최종 상태 매핑
if ($foundVulnerable) {
    Write-Output "{% raw %}{{ CRITICAL || 취약 포트 오픈됨 || 정책 위반 포트가 탐지되었습니다. }}{% endraw %}"
} else {
    Write-Output "{% raw %}{{ OK || 포트 점검 통과 || 모든 보안 포트가 폐쇄 상태입니다. }}{% endraw %}"
}
```

---

## **4. 고급 활용: 윈도우 보안 종합 점검**

단순한 포트 체크를 넘어 방화벽, UAC, BitLocker 등 다양한 보안 설정을 일괄 체크하여 인프라 건전성(Health Check)을 확보할 수 있습니다.

!!! tip "종합 점검 시 유의사항"
    여러 가지 항목을 한 번에 점검할 때는 각 단계마다 로그를 변수에 누적한 뒤, 최종적으로 `Write-Output`을 한 번만 실행하여 전체 결과를 전달하는 방식이 효율적입니다.

---

<div class="next-step-card-container" markdown>
<a href="../../practice/MDRM_운영_학습_안내_실전/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">📋 PART 4: 실전 시나리오 및 운영 관리</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
