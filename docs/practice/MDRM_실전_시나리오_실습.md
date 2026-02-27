# 🥋 실전 시나리오 실습

!!! info "학습 안내"
    MDRM의 핵심 기능을 활용하여 기초적인 인프라 제어부터 실무 서비스 고도화 제어까지, 실제 운영 환경에서 발생 가능한 실전 시나리오를 통합 과제로 실습합니다.

---

## **1. 서버 재기동 시나리오**

시스템 점검 후 필요에 따라 서버를 안전하게 재기동하는 워크플로우를 작성합니다.

!!! abstract "시나리오 목표"
    1.  **대상 서버**: Linux 또는 Windows Agent 서버
    2.  **수행 작업**:
        *   서버의 현재 Uptime 확인
        *   재기동 명령어 전송
        *   재기동 후 정상적으로 Agent가 연결되는지 확인

---

## **2. 대화형 서비스 자동 제어 (Expect)**

패스워드 입력 등 실시간 응답이 필요한 서비스를 자동화합니다.  
*(실습 파일: LINUX 서버 `/app/expect/interactive_service.sh`)*

!!! abstract "시나리오 목표"
    1.  **수행 작업**:
        *   스크립트 실행 시 요구되는 패스워드(`admin123`) 및 포트(`2240`) 자동 입력 처리
        *   정상 기동 후 프로세스 리스트(`ps -ef`)를 통해 서비스 생존 확인

---

## **3. 프로세스 기동 및 로그 모니터링**

네트워크 통신 서비스를 MDRM 프로세스 제어 표준으로 관리합니다.  
*(실습 파일: LINUX 서버 `/app/streamer/uzoo_streamer.sh`)*

!!! abstract "시나리오 목표"
    1.  **수행 작업**:
        *   `Process Control` 컴포넌트를 사용하여 백그라운드(`bg: y`) 기동
        *   기동 후 `uzoo-streamer.log` 파일 기록 확인 및 정상 종료 제어

---

## **4. 시스템 자원 상태 점검**

서버의 디스크 및 시스템 자원 상태를 파악하여 관리 리포트의 기초 데이터를 수집합니다.

!!! abstract "시나리오 목표"
    1.  **대상**: 실습용 Linux 서버
    2.  **수행 작업**:
        *   `Remote Command` 또는 `Shell Script` 컴포넌트로 `df -h` 명령어 실행
        *   디스크 사용량 결과를 MDRM 실행 로그에서 확인

---

## **5. 상태 감시 서비스 기동 및 관리**

서비스의 가용성을 체크하는 감시 프로세스를 기동하고 관리합니다.  
*(실습 파일: LINUX 서버 `/app/watcher/uzoo_watcher.sh`)*

!!! abstract "시나리오 목표"
    1.  **수행 작업**:
        *   `Process Control` 컴포넌트를 사용하여 서비스를 백그라운드로 기동
        *   기동 후 `uzoo-watcher.log` 생성을 확인하고 프로세스의 정상 동작 검증
        *   워크플로우를 통한 프로세스 중단 및 재기동 및 제어 확인

---

## **6. 데이터베이스 기동/종료 제어 (Oracle / MariaDB)**

서비스를 구동하는 중요 백엔드인 데이터베이스의 실행, 종료, 상태 확인 명령어를 컴포넌트를 통해 제어하는 시나리오입니다. 각 데이터베이스 프로세스의 소유자(User) 권한에 맞게 명령어를 구성하십시오.

| 유저 | 실행 명령어 | 종료 명령어 | 확인 명령어 |
| :--- | :--- | :--- | :--- |
| **oracle** | `sqlplus / as sysdba`<br>`startup` | `sqlplus / as sysdba`<br>`shutdown immediate` | **# 프로세스 상태확인**<br>`ps -ef \| grep ${ORACLE_SID}`<br><br>**# DB OPEN 상태확인**<br>`sqlplus / as sysdba`<br>`select status from v$instance;` |
| **root** | `systemctl start mariadb.service` | `systemctl stop mariadb.service` | `ps -ef \| grep mysql`<br>`systemctl status mariadb.service` |

---

!!! success "실전 실습 완료"
    인프라 기초부터 실무 서비스 제어까지 모든 시나리오를 성공적으로 마쳤습니다! 소개해 드린 패턴들은 실제 운영 환경에서 가장 빈번하게 활용되는 핵심 모델이며, 이를 통해 실무 대응 능력을 충분히 확보하셨습니다. 🚀

<div class="next-step-card-container" markdown>
<a href="../MDRM_트러블슈팅_가이드/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🩺 기술 트러블슈팅 가이드 (심화)</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
