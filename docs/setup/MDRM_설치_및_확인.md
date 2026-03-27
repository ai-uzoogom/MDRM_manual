<!-- markdownlint-disable MD046 -->
# ⚙️ 설치 및 확인

!!! info "학습 안내"
    MDRM 패키지의 압축 해제부터 설치 스크립트 실행, 그리고 웹 콘솔을 통한 최종 설치 확인 절차를 학습합니다.

## **1. MDRM 설치 절차**

가이드에 따라 아래 명령어를 순차적으로 실행하여 설치를 진행합니다.

```bash
# 1. 패키지 압축 해제
tar zxvf {{ extra.mdrm.package_name }}

# 2. 설치 디렉토리 이동
cd {{ extra.mdrm.setup_dir }}

# 3. 설치 스크립트 실행 (인자: 호스트명, 데이터경로)
./install.sh $(hostname) {{ extra.mdrm.path_data }}
```

---

## **2. 설치 완료 확인**

!!! success "설치 완료 후 웹 브라우저로 접속 가능"
    - MDRM URL : `https://10.20.xxx.100` (**각 교육생별 할당된 고유 대역의 IP 주소로 접속**)
    - 사용자 ID : `mcuser`
    - 비밀번호 : `mdrm`
    
    ![Login Screen](../assets/images/setup/login.png){: width="100%" }

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_컨테이너_구성/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🚀 MDRM 컨테이너 구성 정보</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
