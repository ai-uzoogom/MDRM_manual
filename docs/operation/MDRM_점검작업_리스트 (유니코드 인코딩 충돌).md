# 스크립트 요약 및 변수 참조

이 문서는 모든 모니터링 스크립트의 특징, 사용된 로직, 입력 변수에 대한 정보를 종합적으로 제공합니다.

## 1. Process CPU Check (SCRIPT_PROC_CPU)
 특정 프로세스의 CPU 점유율(%)을 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_PROC_CPU_Linux.sh | `$1`: `proc_name` (프로세스명)<br>`$2`: `threshold` (임계치 %, Default: 90) | `ps -eo pcpu,args` \| `awk` sum |
| **AIX** | SCRIPT_PROC_CPU_AIX.sh | `$1`: `proc_name`<br>`$2`: `threshold` | `ps -eo pcpu,args` \| `awk` sum |
| **Solaris** | SCRIPT_PROC_CPU_Solaris.sh | `$1`: `proc_name`<br>`$2`: `threshold` | `ps -eo pcpu,args` \| `awk` sum |
| **Windows** | SCRIPT_PROC_CPU_Windows.ps1 | `$args[0]`: `ProcessName`<br>`$args[1]`: `Threshold` | `Get-CimInstance Win32_PerfFormattedData_PerfProc_Process` |

## 2. Process Memory Check (SCRIPT_PROC_MEM)
 특정 프로세스의 메모리(RSS/WorkingSet) 사용량을 확인합니다. **단위: KB**.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_PROC_MEM_Linux.sh | `$1`: `proc_name`<br>`$2`: `threshold` (KB, Default: 102400) | `ps -eo rss,args` \| `awk` sum |
| **AIX** | SCRIPT_PROC_MEM_AIX.sh | `$1`: `proc_name`<br>`$2`: `threshold` (KB) | `ps -eo rss,args` \| `awk` sum |
| **Solaris** | SCRIPT_PROC_MEM_Solaris.sh | `$1`: `proc_name`<br>`$2`: `threshold` (KB) | `ps -eo rss,args` \| `awk` sum |
| **Windows** | SCRIPT_PROC_MEM_Windows.ps1 | `$args[0]`: `ProcessName`<br>`$args[1]`: `Threshold` (KB) | `Get-Process` (`WorkingSet` / 1024) |

## 3. Process Existence Check (SCRIPT_PROC_EXISTS)
 특정 프로세스가 실행 중인지 확인합니다 (인스턴스 개수).

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_PROC_EXISTS_Linux.sh | `$1`: `proc_name`<br>`$2`: `min_count` (최소 개수, Default: 1) | `ps -ef` \| `grep` \| `wc -l` |
| **AIX** | SCRIPT_PROC_EXISTS_AIX.sh | `$1`: `proc_name`<br>`$2`: `min_count` | `ps -ef` \| `grep` \| `wc -l` |
| **Solaris** | SCRIPT_PROC_EXISTS_Solaris.sh | `$1`: `proc_name`<br>`$2`: `min_count` | `ps -ef` \| `grep` \| `wc -l` |
| **Windows** | SCRIPT_PROC_EXISTS_Windows.ps1 | `$args[0]`: `ProcessName`<br>`$args[1]`: `MinCount` | `Get-Process` Count |

## 4. System CPU Check (SCRIPT_SYS_CPU)
 시스템 전체 CPU 사용률(%)을 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_SYS_CPU_Linux.sh | `$1`: `threshold` (Default: 90%) | `top -bn1` \| `Cpu(s)` 라인 파싱 |
| **AIX** | SCRIPT_SYS_CPU_AIX.sh | `$1`: `threshold` | `vmstat 1 2` \| `tail -1` \| `100 - idle` |
| **Solaris** | SCRIPT_SYS_CPU_Solaris.sh | `$1`: `threshold` | `vmstat 1 2` \| `tail -1` \| `100 - idle` |
| **Windows** | SCRIPT_SYS_CPU_Windows.ps1 | `$args[0]`: `Threshold` | `Get-CimInstance Win32_Processor` (`LoadPercentage`) |

## 5. System Memory Check (SCRIPT_SYS_MEM)
 시스템 전체 메모리 사용률(%)을 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_SYS_MEM_Linux.sh | `$1`: `threshold` (Default: 90%) | `free` \| `(used / total) * 100` |
| **AIX** | SCRIPT_SYS_MEM_AIX.sh | `$1`: `threshold` | `svmon -G -O unit=GB` \| `(inuse / size) * 100` |
| **Solaris** | SCRIPT_SYS_MEM_Solaris.sh | `$1`: `threshold` | `prtconf` (Total) & `vmstat` (Free Pages) |
| **Windows** | SCRIPT_SYS_MEM_Windows.ps1 | `$args[0]`: `Threshold` | `Win32_OperatingSystem` (`TotalVisible` vs `FreePhysical`) |

## 6. System Disk Check (SCRIPT_SYS_DISK)
 특정 마운트 포인트의 디스크 사용률(%)을 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_SYS_DISK_Linux.sh | `$1`: `mount_point` (예: /)<br>`$2`: `threshold` (Default: 90%) | `df -P` |
| **AIX** | SCRIPT_SYS_DISK_AIX.sh | `$1`: `mount_point`<br>`$2`: `threshold` | `df -g` (fallback `df -k`) |
| **Solaris** | SCRIPT_SYS_DISK_Solaris.sh | `$1`: `mount_point`<br>`$2`: `threshold` | `df -k` |
| **Windows** | SCRIPT_SYS_DISK_Windows.ps1 | `$args[0]`: `DriveLetter` (예: C)<br>`$args[1]`: `Threshold` | `Get-PSDrive` |

## 7. Network Port Check (SCRIPT_NET_PORT)
 특정 포트가 Listening 상태인지 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_NET_PORT_Linux.sh | `$1`: `port` (예: 80) | `netstat -an` \| `grep LISTEN` |
| **AIX** | SCRIPT_NET_PORT_AIX.sh | `$1`: `port` | `netstat -an` \| `grep LISTEN` |
| **Solaris** | SCRIPT_NET_PORT_Solaris.sh | `$1`: `port` | `netstat -an` \| `grep LISTEN` |
| **Windows** | SCRIPT_NET_PORT_Windows.ps1 | `$args[0]`: `Port` | `Get-NetTCPConnection -State Listen` |

## 8. Log File Check (SCRIPT_LOG_CHECK)
 로그 파일에서 특정 키워드가 발생하는지 확인합니다.

| OS | 스크립트 파일 | 입력 변수 | 핵심 로직 / 명령어 |
| :--- | :--- | :--- | :--- |
| **Linux** | SCRIPT_LOG_CHECK_Linux.sh | `$1`: `keyword` (키워드)<br>`$2`: `logfile` (절대경로) | `grep -c "keyword" "file"` |
| **AIX** | SCRIPT_LOG_CHECK_AIX.sh | `$1`: `keyword`<br>`$2`: `logfile` | `grep -c` |
| **Solaris** | SCRIPT_LOG_CHECK_Solaris.sh | `$1`: `keyword`<br>`$2`: `logfile` | `grep -c` |
| **Windows** | SCRIPT_LOG_CHECK_Windows.ps1 | `$args[0]`: `Keyword`<br>`$args[1]`: `LogFile` | `Select-String` Count |
