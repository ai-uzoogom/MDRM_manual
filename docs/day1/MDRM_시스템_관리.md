# 🛠️ 시스템 관리

Docker 환경에서 MDRM 서비스의 이상 유무를 확인하거나 서버 내부에 접속하여 작업을 수행할 때 필요한 기본 명령어 안내 가이드입니다.

---

## **1. 명령어 실행 위치 확인**

모든 `docker compose` 명령어는 `docker-compose.yml` 파일이 존재하는 디렉토리에서 실행해야 합니다.

* **기본 경로**: `/mdrm/data/bin/`
* **이동 명령어**: `cd /mdrm/data/bin`

---

## **2. MDRM 서비스 상태 확인**

현재 실행 중인 모든 컨테이너의 상태(`Up`, `Exit`, `Restarting` 등)를 확인합니다.

```bash
# 컨테이너 상태 요약 조회
docker compose ps
```

---

## **3. 실시간 로그 모니터링**

서비스가 정상적으로 시작되지 않거나 동작 중 오류가 발생할 경우, 실시간으로 로그를 추적하여 문제 원인을 파악할 수 있습니다.

```bash
# 전체 서비스의 실시간 로그 확인
docker compose logs -f

# 특정 컨테이너(예: gam)의 로그만 추적 확인
docker compose logs -f gam
```

---

## **4. 'gam' 컨테이너 내부 접속**

MDRM의 핵심 로직이 구동되는 `gam` 컨테이너 내부 쉘(Shell)에 직접 접속하여 작업을 수행할 수 있습니다.

```bash
# gam 컨테이너 내부로 접속 (bash 쉘 실행)
docker exec -it gam bash
```

!!! tip "접속 종료 방법"
    컨테이너 내부 작업을 마친 후 원래의 호스트 터미널로 돌아오려면 `exit`를 입력해 주십시오.

<center>
    <p style="opacity: 0.5; font-size: 0.8rem;">
        이것으로 <strong>MDRM 설치 및 운영</strong> 파트의 교육 단계를 마칩니다. 수고하셨습니다!
    </p>
</center>
