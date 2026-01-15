# 📋 사전작업

## 서버 스펙 권장사항 확인

!!! info "DATA DISK 영역 구성"
    MDRM 운영을 위해 다음과 같은 디렉토리 구조를 권장합니다.

| 경로 | 설명 | 비고 |
|:---|:---|:---:|
| `/mdrm/engine` | Docker 컨테이너의 엔진영역 | - |
| `/mdrm/data` | MDRM에 실질적인 DATA가 볼륨매핑되어 있는 곳 | ⚠️ **백업영역** |
| `/mdrm/package` | MDRM 설치 및 기타 용으로 사용 | - |

---

## 컨테이너 환경 준비

- OS 배포판 종류에 따라 **Docker** 또는 **Podman**으로 진행
- docker 및 docker-compose 설치법
    - Docker 공식 repository를 통한 설치 (yum/dnf 명령어를 통한 설치)
    - docker 공식 배포사이트에서 패키지 다운로드하여 설치

---

## Docker 환경설정

### 브릿지 네트워크 설정

컨테이너는 내부에 가상의 브릿지 네트워크망 사용

- 사용하지 않는 IP대역으로 설정 (기본: 172 대역)
- 확인 명령어:

```bash
docker network ls
NETWORK ID     NAME       DRIVER    SCOPE
e01818b09fac   bin_mdrm   bridge    local ⭐
00348b82bd83   bridge     bridge    local
bc2c03ceadde   host       host      local
110143ec5d72   none       null      local
```

### 컨테이너 기본 위치 변경

!!! warning "저장 공간 확보"
    **최소 50GB 이상** 확보된 곳으로 설정

### 로그 설정

설정파일: `/etc/docker/daemon.json`

| 설정 항목 | 값 |
|:---|:---|
| log 파일 형태 | json |
| 로그 파일 최대 크기 | 100MB |
| 로그 파일 최대 갯수 | 5개 |

#### daemon.json 예시

```json
{
  "data-root": "/mdrm/engine",
  "bip": "182.18.0.1/16",
  "default-address-pools": [
    {
      "base": "182.19.0.1/16",
      "size": 24
    }
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  }
}
```

!!! tip "설정 항목 설명"
    - **data-root**: Docker 데이터 저장 위치
    - **bip**: 기본 브릿지 네트워크 IP
    - **default-address-pools**: 컨테이너 네트워크 IP 풀
    - **log-driver**: 로그 드라이버 (json-file 권장)
    - **log-opts**: 로그 파일 크기 및 개수 제한
