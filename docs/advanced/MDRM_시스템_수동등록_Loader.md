# 🛠️ 시스템 대량 수동 등록 (System Loader)

!!! info "가이드 대상"
    본 가이드는 MDRM 엔지니어를 대상으로 하며, **System Loader** 도구를 활용하여 대량의 관리 대상 시스템을 DB에 일괄 등록하는 방법을 설명합니다.
    (지원 버전: MDRM 4.6.2.3 이상)

    *   **원본 문서**: [시스템 수동등록방법 (CSV)](https://mantech.jira.com/wiki/spaces/VM/pages/3767697884/-+CSV)

---

## **1. 도구 설치**

System Loader는 MDRM 컨테이너 내부에서 실행되는 도구입니다.

### **1.1 파일 준비 및 복사**
배포된 `gam_system_loader` 파일을 컨테이너로 전송합니다.

| 파일명 | 비고 |
| :--- | :--- |
| `gam_system_loader_V4.6.3.tar` | **권장** |
| `gam_system_loader_V4.6.2.3.tar` | 권장하지 않음 |

```bash
# 1. 파일 복사 (Host -> Container)
# cp gam_system_loader_<Version>.tar /opt/gam/
# 예시: MDRM_SVR 컨테이너로 복사
docker cp gam_system_loader_V4.6.3.tar MDRM_SVR:/opt/gam/

# 2. 컨테이너 접속
docker exec -it <컨테이너 이름> bash

# 3. 압축 해제 및 이동
cd /opt/gam
tar xvf gam_system_loader_V4.6.3.tar
cd import
```

### **1.2 라이브러리 설치**
Loader 실행에 필요한 파이썬 라이브러리를 설치합니다.

```bash
# 설치 스크립트 실행
./install.sh
```

---

## **2. 데이터 파일 준비**

등록할 시스템 목록을 정의하는 `system.csv` 파일을 작성합니다.

### **2.1 파일 구조 (Format)**
항목은 **세미콜론(;)**으로 구분하며, 마지막에 세미콜론을 붙이지 않습니다.

| 항목 | 필수 | 설명 | 예시 |
| :--- | :---: | :--- | :--- |
| **GRP_ID** | O | 시스템 트리 그룹 아이디 | `G0000` |
| **NODE_NAME** | O | 서버 이름 (Hostname) | `ORACLE_SVR` |
| **NODE_IP** | O | 서버 IP 주소 (중복 불가) | `10.20.30.40` |
| **OS_CODE** | O | 운영체제 코드 | `L0000` |
| **NODE_ID** | X | 자동 생성되므로 입력 불필요 | (비워둠) |

### **2.2 OS 코드표**

*   **W0000**: Windows
*   **L0000**: Linux
*   **U0101**: Solaris
*   **U0201**: AIX
*   **U0301**: HPUX

### **2.3 작성 예시 (system.csv)**

```properties
# MDRM version: 4.6.2.3 higher
# 설명: GRP_ID;NODE_NAME;NODE_IP;OS_CODE
# 주의: 중복된 IP는 등록되지 않습니다.

G0000;ORCLE_SVR1;127.0.0.1;W0000
G0000;WEB_SVR1;127.0.0.2;L0000
G0001;WAS_SVR1;192.168.0.10;U0201
```

!!! warning "주의사항"
    *   **IP 중복 체크**: 이미 등록된 IP 주소이거나, CSV 파일 내에 중복된 IP가 있을 경우 해당 라인은 건너뜁니다.
    *   **주석 처리**: `#`으로 시작하는 라인은 무시됩니다.

---

## **3. 도구 사용 및 등록 명령**

`main.sh` 스크립트를 사용하여 조회, 등록, 삭제 작업을 수행할 수 있습니다.

### **3.1 주요 명령어**

| 기능 | 명령어 형식 | 설명 |
| :--- | :--- | :--- |
| **그룹 조회** | `./main.sh groups` | 현재 등록된 시스템 그룹 ID 목록을 조회합니다. |
| **노드 목록** | `./main.sh nodes <GRP_ID>` | 특정 그룹에 소속된 시스템들의 NODE_ID를 확인합니다. |
| **일괄 등록** | `./main.sh import <파일경로>` | 작성한 데이터 파일을 읽어 DB에 시스템을 일괄 등록합니다. |
| **삭제** | `./main.sh delete <NODE_ID>` | 특정 시스템을 삭제합니다. (오등록 시 사용) |

### **3.2 시스템 등록 실행 (Import)**

작성한 CSV 파일을 지정하여 등록을 수행합니다. **파일 경로는 절대 경로**를 권장합니다.

```bash
# 실행 구문
./main.sh import /opt/gam/import/data/system.csv

# 실행 결과 로그 예시
# [INFO] Reading data file...
# [INFO] Processing: ORCLE_SVR1 (127.0.0.1)... REGISTERED (ID: N0010)
# [WARN] Processing: WEB_SVR2 (127.0.0.2)... SKIPPED (Duplicate IP)
# [INFO] Done. Total 2 processed.
```

!!! tip "결과 확인"
    등록이 완료되면 웹 콘솔의 **시스템 관리** 메뉴에서 새로고침하여 추가된 서버들을 확인합니다.
