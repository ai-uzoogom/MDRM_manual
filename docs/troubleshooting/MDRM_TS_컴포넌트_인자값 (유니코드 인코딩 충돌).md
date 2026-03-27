# ⚠️ 유의사항: 인자값(Argument) 충돌

!!! danger "부모 프로세스 중복 탐지 주의"
    MDRM Agent가 스크립트를 실행할 때, 전달받은 인자값이 프로세스 리스트의 전체 명령줄에 노출되어 발생하는 부모 프로세스 중복 탐지 문제를 설명합니다.

## **1. 문제 상황 시나리오**

MDRM Agent가 컴포넌트를 구동하면, OS 프로세스 리스트에는 실행 중인 스크립트와 함께 **전달된 인자값**이 그대로 나타납니다.

```bash
# ps -ef 결과 예시
# Agent가 "sh my_start.sh monitoring.jar" 명령을 수행 중인 상태
root  1234  5678  0 14:00 ?  00:00:00 /bin/sh ./my_start.sh monitoring.jar
```

### **왜 실패하는가?**
`pgrep -f` 명령은 프로세스의 전체 명령줄(Full Command Line)을 검색합니다. 따라서 실제 서비스(`monitoring.jar`)가 실행 중이지 않더라도, **현재 이 스크립트를 실행 중인 부모 프로세스**에서 해당 문자열이 검색되어 버립니다.

```bash
#!/bin/bash
PROCESS_NAME=$1  # "monitoring.jar"가 대입됨

# pgrep -f는 부모 프로세스의 명령줄도 검색 대상에 포함시킵니다.
if pgrep -f "$PROCESS_NAME" > /dev/null; then
    echo "[ERROR] 이미 프로세스가 실행 중입니다."
    exit 0  # 실제 서비스가 죽어 있어도 여기서 중단됩니다.
fi
```

---

## **2. 해결 방법**

### **① 인자값 전달 지양 (변수 고정)**
프로세스 체크용 핵심 키워드는 인자로 넘기지 않고, 스크립트 내부에 변수로 고정(Hard-coding)하여 관리하는 것이 가장 안전합니다.

### **② 현재 PID 제외 (`$$` 활용)**
검색 결과에서 현재 실행 중인 스크립트의 PID(`$$`)를 제외하도록 필터링을 추가합니다.

```bash
# 현재 PID($$)를 결과에서 제외하여 부모 프로세스 오탐지를 방지합니다.
if pgrep -f "$PROCESS_NAME" | grep -v "^$$" > /dev/null; then
    echo "[SUCCESS] 실제 서비스 프로세스가 실행 중임을 확인했습니다."
fi
```

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
