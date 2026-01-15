# ⚙️ 설치

## MDRM 설치 절차

```bash
# 1. /mdrm/package 에 패키지 업로드

# 2. 압축 풀기
tar zxvf mdrm*.tar.gz

# 3. 압축 푼 디렉토리로 이동
cd {압축풀린 mdrm}

# 4. 설치 스크립트 실행
./install.sh $(hostname) /mdrm/data
# - Docker 이미지 로드 및 초기 DB 생성
# - 이후, docker-compose up -d 옵션으로 컨테이너 생성

# 5. WEB 브라우저를 통한 접속 확인

# 6. 기본 계정으로 로그인
# mcuser / mdrm
```

---

## 설치 완료 확인

!!! success "설치 완료 후 웹 브라우저로 접속 가능"
    
    **기본 계정 정보**
    
    | 항목 | 값 |
    |:---|:---|
    | 사용자 ID | `mcuser` |
    | 비밀번호 | `mdrm` |

---

## 설치 시 주의사항

!!! warning "설치 전 확인 사항"
    - Docker 또는 Podman이 정상적으로 설치되어 있는지 확인
    - `/mdrm/data` 디렉토리에 충분한 디스크 공간이 있는지 확인
    - 방화벽 설정에서 필요한 포트가 열려있는지 확인
