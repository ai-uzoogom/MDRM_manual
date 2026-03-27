# 🔌 API 계정 생성과 원격 워크플로우 제어

!!! info "학습 안내"
    MDRM의 RESTful API를 활용하여 외부 시스템에서 워크플로우를 원격으로 제어하는 방법을 학습합니다.
    **API 전용 계정 생성**부터 **인증 방식**, 그리고 **워크플로우 실행 및 상태 조회**를 위한 주요 API 명세를 다룹니다.

---

## **1. API 계정 생성 및 설정**

MDRM API를 호출하기 위해서는 적절한 권한을 가진 사용자 계정이 필요합니다. 보안을 위해 관리자(Admin) 계정과는 별도로 **API 전용 계정**을 생성하여 사용하는 것을 권장합니다.

### **1.1 API 호출 기본 정보 (예시)**

본 가이드에서는 다음 환경을 기준으로 설명합니다.

| 항목 | 값 | 설명 |
|:---|:---|:---|
| **서버** | `10.120.30.91` | MDRM 서버 주소 |
| **계정** | `mdrm_api` | API 호출 계정 |
| **암호** | `password` | API 호출 계정의 암호 |
| **워크플로우 ID** | `1` | 워크플로우 고유 번호 (JOB_ID) |

### **1.2 사용자 생성**
1.  MDRM 웹 콘솔에 `admin` 계정으로 로그인합니다.
2.  **시스템 관리 > 사용자 관리** 메뉴로 이동합니다.
3.  **[사용자 추가]** 버튼을 클릭합니다.
4.  다음 정보를 입력하여 계정을 생성합니다:
    *   **ID**: `mdrm_api`
    *   **이름**: API 연동 계정
    *   **권한**: `System Admin`
    *   **비밀번호**: 강력한 비밀번호 설정 (`password`)

### **1.3 API 계정 잠금 방지 설정 (DB)**

API 호출용 계정은 **웹 로그인이 불가능**하며, 장기 미접속(90일) 시에도 계정이 잠기지 않는 특수 계정입니다.

1.  MDRM 컨테이너 내부 또는 DB 접속 툴을 통해 MDRM 데이터베이스에 접속합니다.
2.  다음 SQL을 실행하여 계정 속성을 업데이트합니다.

```sql
UPDATE users
SET lock_flg = '8'
WHERE user_id = 'mdrm_api';
```

### **1.4 인증 토큰 발급 (로그인)**

MDRM API는 **Bearer Token** 인증 방식을 사용합니다. 먼저 로그인 API를 호출하여 토큰을 발급받아야 합니다.

*   **URL**: `POST /api/v1/auth`
*   **Header**: `Content-Type: application/json`
*   **Body**: `{"user_id": "mdrm_api", "pwd": "password"}`

**토큰 발급 요청 예시:**
```bash
curl -k -i 'https://10.120.30.91/api/v1/auth' \
  --header 'Content-Type: application/json' \
  --data '{"user_id": "mdrm_api", "pwd": "password"}'
```

**응답 결과 (예시):**
```json
{
  "message": "Success",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

!!! note "토큰 사용"
    응답받은 `token` 값(Bearer 포함)을 이후 모든 API 호출 시 `Authorization` 헤더에 포함해야 합니다.

---

## **2. 워크플로우 제어 API**

외부 스케줄러(Control-M, Autosys 등)나 관제 시스템에서 MDRM 워크플로우를 트리거할 때 사용하는 주요 API입니다.

!!! warning "사전 요구사항"
    *   모든 API 요청은 **HTTPS** 프로토콜을 사용해야 합니다.
    *   Header에 `Authorization: <Issued_Token>`이 포함되어야 합니다.

### **2.1 워크플로우 목록 조회**
등록된 워크플로우의 ID(`wf_id`)를 확인하기 위해 사용합니다.

*   **URL**: `GET /services/workflow/list`
*   **Response**:
    ```json
    {
      "result": "success",
      "workflows": [
        { "id": "1", "name": "일일_서비스_기동", "group": "운영" },
        { "id": "2", "name": "재해복구_전환", "group": "DR" }
      ]
    }
    ```

### **2.2 워크플로우 실행 (Execute)**
특정 워크플로우를 비동기적으로 실행합니다.

*   **URL**: `POST /services/workflow/execute`
*   **Parameters**:
    *   `wf_id` (String): 실행할 워크플로우 ID
    *   `sync` (Boolean): `false` (비동기권장), `true` (동기)
*   **Example (cURL)**:
    ```bash
    curl -X POST -k https://10.120.30.91/services/workflow/execute \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
      -d "wf_id=1" \
      -d "sync=false"
    ```
*   **Response**:
    ```json
    {
      "result": "success",
      "execution_id": "EXEC_20240520_0001",
      "message": "Workflow started successfully."
    }
    ```

### **2.3 실행 상태 조회 (Status)**
실행 중인 워크플로우의 진행 상태를 확인합니다.

*   **URL**: `GET /services/workflow/status`
*   **Parameters**:
    *   `execution_id`: 실행 시 반환받은 실행 ID
*   **Response**:
    ```json
    {
      "execution_id": "EXEC_20240520_0001",
      "status": "RUNNING",  // RUNNING, COMPLETED, FAILED, PAUSED
      "current_step": "DB_Service_Start",
      "progress": 45
    }
    ```

### **2.4 워크플로우 중지/일시정지**
비상 상황 시 실행 중인 워크플로우를 제어합니다.

*   **URL**: `POST /services/workflow/control`
*   **Parameters**:
    *   `execution_id`: 실행 ID
    *   `action`: `stop` (강제종료) / `pause` (일시정지) / `resume` (재개)

---

## **3. 보안 권장사항**

API 사용 시 다음 보안 수칙을 준수하십시오.

1.  **IP 접근 제어 (ACL)**: MDRM 서버의 방화벽(Firewall) 또는 `iptables`를 통해 API를 호출하는 외부 시스템(관제, 스케줄러)의 IP만 허용하십시오.
2.  **SSL 인증서 적용**: 평문 통신을 방지하기 위해 공인 인증서 또는 사설 인증서를 적용하여 HTTPS 통신을 강제하십시오.
3.  **최소 권한 부여**: API 전용 계정에는 시스템 설정 변경 권한을 제외하고, **워크플로우 실행 및 조회 권한**만 부여하십시오.

