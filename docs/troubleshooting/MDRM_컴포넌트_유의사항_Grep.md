# ⚠️ 유의사항: Grep 자기 자신 탐지

!!! danger "프로세스 탐지 시 오판 주의"
    프로세스 존재 여부를 확인하기 위해 `grep` 명령을 사용할 때, 실행 중인 `grep` 명령 자체가 결과에 포함되어 발생하는 오판 문제를 해결하는 방법을 안내합니다.

## **1. 문제의 핵심 (Grep Self-Detection)**

프로세스가 구동 중인지 확인하기 위해 `ps -ef | grep '프로세스명'`을 실행하면, 해당 `grep` 명령어 자체가 OS 프로세스 리스트에 나타나면서 예기치 않은 결과가 발생할 수 있습니다.

| 항목 | 상세 내용 |
|:---|:---|
| **원인** | `grep $1` 이라는 검색 명령어 자체가 하나의 프로세스로 인식됩니다. |
| **현상** | `ps -ef` 결과 리스트에 `grep  monitoring.jar` 와 같은 라인이 포함됩니다. |
| **결과** | 실제 서비스가 중지된 상태임에도 `grep`이 자기 자신을 찾아내어 **1건 이상 발견**한 것으로 판단하게 됩니다. |

### **[잘못된 사용 예시]**
```bash
# 서비스가 죽어 있어도 CNT는 항상 1 이상의 값을 가집니다.
CNT=$(ps -ef | grep $1 | wc -l)

if [ $CNT -gt 0 ]; then
    echo "[ERROR] 이미 실행 중입니다. (발견 건수: $CNT)"
    exit 0
fi
```

---

## **2. 해결 방법**

### **① `grep -v grep` 조합**
가장 전통적인 방법으로, 검색 결과에서 `grep` 문자열이 포함된 라인을 강제로 제외합니다.
```bash
# 검색 결과에서 grep 프로세스 자체를 제외하고 카운트합니다.
ps -ef | grep "monitoring.jar" | grep -v grep
```

### **② `pgrep` 명령어 활용**
`pgrep`은 프로세스 이름으로 PID를 찾는 전용 유틸리티입니다. `grep` 프로세스 탐지 문제를 원천적으로 방지할 수 있어 권장되는 방식입니다.
```bash
# -f 옵션 사용 시 전체 명령줄에서 프로세스를 검색합니다.
if pgrep -f "monitoring.jar" > /dev/null; then
    echo "서비스가 현재 실행 중입니다."
fi
```

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_컴포넌트_유의사항_인자값/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Troubleshooting 02</span>
        <span class="next-step-title">인자값(Argument) 충돌</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
