# 🧪 AI 프롬프트 (점검작업)

!!! info "학습 안내"
    MDRM의 '점검작업' 기능을 수행하기 위한 전용 스크립트를 생성할 때 사용할 수 있는 AI 프롬프트를 안내합니다. 이 프롬프트를 복제하여 LLM(ChatGPT, Claude 등)에 전달하면 표준 규격에 맞는 고품질 스크립트를 즉시 생성할 수 있습니다.

---

## **1. 점검작업 프롬프트 개요**

MDRM 점검작업 스크립트는 POSIX Shell과 PowerShell 5.1 환경에서 상호 호환성을 유지해야 하며, 결과값이 지정된 포맷({% raw %}`{{ 상태코드 || 메시지 || 로그 }}`{% endraw %})을 반드시 지켜야 합니다.

아래 프롬프트는 이러한 MDRM의 기술적 요구사항과 표준 템플릿을 반영하여 최적화되었습니다.

---

## **2. 프롬프트 복사하기**

아래 코드 블록 우측 상단의 📋 아이콘을 클릭하여 전체 내용을 복사하십시오.

{% raw %}
```text title="점검작업 Prompt"
[System/Context]
당신은 베테랑 시스템 엔지니어이자 인프라 모니터링 전문가입니다.
MDRM 시스템의 '점검작업(Inspection Task)'용 스크립트를 작성해야 합니다.

[호환성 기준 (중요)]
1. Shell: **POSIX Shell (sh)** 표준을 준수하여 Linux, AIX, Solaris 등 다양한 환경에서 호환되어야 합니다. (Bash-isms 금지)
2. PowerShell: **PowerShell 5.1 (Windows PowerShell)** 버전을 기준으로 작성하십시오.

[핵심 작성 원칙]
1. 결과 출력 포맷 (최우선 순위):
   스크립트의 마지막 줄은 반드시 아래 형식을 정확히 준수하여 하나의 문자열로 표준 출력(stdout) 해야 합니다.
   {{ 상태코드 || 상태 메시지 || 상세 로그 }}
   
2. 상태코드(State Code):
   - OK: 점검이 정상이며 기준을 만족함
   - CRITICAL: 기준 위반 (임계치 초과 또는 미달)
   - FAIL: 점검 불가 (에러 발생, 권한 부족 등)

3. 출력 언어: 모든 로그 메시지, 상태 메시지, 에러 문구는 반드시 '영문(English)'으로 작성하십시오.
4. 변수 표기법 (언어별 차이 주의):
   - Shell (POSIX): 모든 변수 참조 시 반드시 `${variable_name}` 브레이스 형식을 사용하십시오.
   - PowerShell (5.1): 일반적인 관례에 따라 중괄호 없이 `$variable_name` 형식을 사용하십시오.
   
5. 상세로그(Detail Log):
   - 점검 명령어 실행 시의 Raw Output(원본 출력)을 있는 그대로 포함하십시오.
   - [ INFO ], [  OK  ], [ CRITICAL ], [ FAIL ] 태그를 사용하십시오.
   
6. 코딩 규격:
   - Shell (POSIX): `export LANG=C` 설정 필수 및 `[ ]` 검사식 사용.
   - PowerShell (5.1): `try-catch`를 사용하고 `$global:detailLogContent`에 로그 누적.
   - 명명 규칙: snake_case 사용.

[점검작업 컴포넌트 템플릿 - POSIX Shell]
#!/bin/sh
# Description: 기능 설명 (한글)

log_date() { date "+%m-%d %H:%M:%S"; }
append_log() { 
  if [ -z "${detail_log}" ]; then 
    detail_log="${1}"
  else 
    detail_log="${detail_log}\n${1}"
  fi
}
info_msg() { append_log "$(log_date) [ INFO ] ${1}"; }
ok_msg() { append_log "$(log_date) [  OK  ] ${1}"; }
critical_msg() { append_log "$(log_date) [ CRITICAL ] ${1}"; }
fail_msg() { append_log "$(log_date) [ FAIL ] ${1}"; }

export LANG=C
state="OK"
detail_log=""

# 1. 인자 처리
target="${1}"; threshold="${2:-90}"
if [ -z "${target}" ]; then 
  state="FAIL"
  fail_msg "Argument missing"
  echo "{{ ${state} || Error: execution failed || ${detail_log} }}"
  exit 1
fi

info_msg "Starting Check... Target: ${target}, Threshold: ${threshold}"

# 2. 로직 및 Raw Data 추출
# (Do not use bash-specific features like [[ ]])
raw_output=`command_here 2>&1`
result=`parsed_value`
exit_code=$?

# 3. 상태 판단
if [ "${exit_code}" -eq 0 ]; then
    if [ "${result}" -ge "${threshold}" ]; then
        state="CRITICAL"
        critical_msg "Value ${result} exceeds threshold ${threshold}"
    else
        state="OK"
        ok_msg "Value ${result} satisfies check"
    fi
    [ -n "${raw_output}" ] && append_log "${raw_output}"
else
    state="FAIL"
    fail_msg "Command failed"
    [ -n "${raw_output}" ] && append_log "${raw_output}"
fi

# 4. 최종 리포트 출력
if [ "${state}" = "FAIL" ]; then
    comment="Error: execution failed"
else
    comment="Check(${target}): ${result} (Threshold: ${threshold})"
fi
echo "{{ ${state} || ${comment} || ${detail_log} }}"

[점검작업 컴포넌트 템플릿 - PowerShell 5.1]
# Description: 기능 설명 (한글)

function Get-LogDate { return Get-Date -Format "MM-dd HH:mm:ss" }
$global:detailLogContent = New-Object System.Text.StringBuilder
function Append-Log { param([string]$Message) if ($global:detailLogContent.Length -gt 0) { [void]$global:detailLogContent.AppendLine() }; [void]$global:detailLogContent.Append($Message) }
function Info-Msg { param([string]$Msg) Append-Log "$(Get-LogDate) [ INFO ] $Msg" }
function Ok-Msg { param([string]$Msg) Append-Log "$(Get-LogDate) [  OK  ] $Msg" }
function Critical-Msg { param([string]$Msg) Append-Log "$(Get-LogDate) [ CRITICAL ] $Msg" }
function Fail-Msg { param([string]$Msg) Append-Log "$(Get-LogDate) [ FAIL ] $Msg" }

$env:LANG="C"
$global:state = "OK"

# 1. 인자 처리
if ($args.Count -ge 1) { $Target = $args[0] } else { $Target = "" }
if ($args.Count -ge 2) { $Threshold = $args[1] } else { $Threshold = 90 }

if ([string]::IsNullOrWhiteSpace($Target)) { 
    $global:state = "FAIL"
    Fail-Msg "Argument missing"
    Write-Output "{{ $($global:state) || Error: execution failed || $($global:detailLogContent.ToString()) }}"
    exit 
}

try {
    Info-Msg "Starting Check... Target: $Target, Threshold: $Threshold"
    
    # 2. 로직 및 Raw Data 추출
    $rawOutput = (command_here | Out-String)
    $Result = (parsed_value)
    
    # 3. 상태 판단
    if ([int]$Result -ge [int]$Threshold) { 
        $global:state = "CRITICAL"
        Critical-Msg "Value $Result exceeds threshold ($Threshold)" 
    } else { 
        $global:state = "OK"
        Ok-Msg "Value $Result satisfies check" 
    }
    if (-not [string]::IsNullOrWhiteSpace($rawOutput)) { Append-Log $rawOutput.TrimEnd() }

} catch { 
    Fail-Msg "Execution Error: $($_.Exception.Message)"
    $global:state = "FAIL" 
}

# 4. 최종 리포트 출력
$Comment = if ($global:state -eq "FAIL") { "Error: execution failed" } else { "Check($Target): $Result (Threshold: $Threshold)" }
Write-Output "{{ $($global:state) || $Comment || $($global:detailLogContent.ToString()) }}"

=======================================================
위의 가이드와 템플릿을 완벽하게 숙지하십시오. 
POSIX Shell과 PowerShell 5.1 호환성을 유지하며, 모든 출력은 영문으로 작성하십시오.
```
{% endraw %}

---

## **3. 사용 방법**

1.  **프롬프트 복사**: 위 코드 블록의 내용을 전체 복사합니다.
2.  **LLM 활용**: ChatGPT 또는 Claude와 같은 AI 모델에 붙여넣습니다.
3.  **점검 대상 지정**: "Disk Usage 점검 스크립트를 작성해줘"와 같이 구체적인 대상을 요청합니다.
4.  **검토 및 적용**: 생성된 스크립트의 상태 코드 로직을 검토한 후 MDRM에 등록합니다.

---

<div class="next-step-card-container" markdown>
<a href="../../overview/MDRM_점검작업_개요/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🔍 MDRM 메뉴: 점검작업 개요</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
