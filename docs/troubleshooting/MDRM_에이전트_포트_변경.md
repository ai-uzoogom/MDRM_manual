# ⚙️ MDRM 에이전트 기본 포트(20080) 변경 가이드

!!! info "포트 변경 목적"
    MDRM 에이전트의 기본 통신 포트인 **20080**이 고객사 정책으로 사용 불가능할 경우, 포트 번호를 변경하여 운영 환경을 구성하는 방법을 안내합니다.

| 구분 | 상세 내용 |
|:---|:---|
| **기본 포트** | 20080 |
| **지원 버전** | MDRM 4.6.1, 4.6.2 이상 |
| **주의 사항** | 현재 버전에서는 노드별로 다른 포트를 지정할 수 없습니다. (전체 에이전트 공통 적용) |

---

## **1. [4.6.1 이전 버전] 환경설정 파일 변경**

MDRM 서버의 설정 파일을 직접 수정하여 에이전트 포트를 변경합니다.

### **① 설정 파일 수정**
`gam` 컨테이너에 접속하여 `wind-config.properties` 파일을 엽니다.

```bash
# gam 컨테이너 접속
docker exec -it gam bash

# 설정 파일 편집
vi /gampkgs/data/config/wind-config.properties
```

`wind.dr.agent.port` 항목의 값을 원하는 포트 번호(예: 20081)로 수정합니다.
```properties
wind.dr.agent.port=20081
```

### **② 서비스 재시작**
수정 사항을 적용하기 위해 톰캣 또는 컨테이너를 재시작합니다.
```bash
# 컨테이너 내 톰캣 재시작
service tomcat8 restart 

# 또는 컨테이너 자체 재시작
docker restart gam 
```

---

## **2. [4.6.2 이상 버전] DB 설정 변경**

4.6.2 이상 버전에서는 환경설정 파일 수정(위 1번 과정)과 함께 **DB의 계정 테이블 값**도 반드시 수정해야 워크플로우 등에서 정상 작동합니다.

### **① DB 접속 및 데이터 수정**
`mdrm-postgres` 컨테이너에 접속하여 포트 정보를 업데이트합니다.

```bash
# DB 컨테이너 접속 및 psql 실행
docker exec -it mdrm-postgres bash 
psql -p 5433 -U mccs

# 에이전트 통신 포트 업데이트 (20081로 변경 예시)
update accounts set conn_port = '20081' where acc_id = 0;
```

*   **참고**: DB 수정한 데이터는 별도의 서비스 재시작 없이 즉시 적용됩니다.

---

## **3. 변경 사항 적용 범위**

| 버전 구분 | 적용 항목 |
|:---|:---|
| **4.6.1 이전** | 에이전트 연결 테스트, 시스템 요약, 점검작업, 워크플로우 |
| **4.6.2 이상** | 워크플로우 실행을 포함한 전체 기능 (**파일과 DB 설정 모두 필요**) |

---

<div class="next-step-card-container" markdown>
<a href="../../" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Troubleshooting End</span>
        <span class="next-step-title">메인 화면으로 돌아가기</span>
    </span>
    <span class="next-step-icon">🏠</span>
</a>
</div>
