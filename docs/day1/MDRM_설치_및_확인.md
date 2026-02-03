<!-- markdownlint-disable MD046 -->
# ⚙️ 설치 및 확인

!!! info "학습 안내"
    MDRM 패키지의 압축 해제부터 설치 스크립트 실행, 그리고 웹 콘솔을 통한 최종 설치 확인 절차를 학습합니다.

## **1. MDRM 설치 절차**

1.  **패키지 업로드**
    - `/mdrm/package` 경로에 설치 패키지를 업로드합니다.

2.  **압축 풀기**
    ```bash
    tar zxvf mdrm*.tar.gz
    ```

3.  **디렉토리 이동**
    - 압축이 해제된 디렉토리로 이동합니다.
    ```bash
    cd {압축풀린 mdrm}
    ```

4.  **설치 스크립트 실행**
    - 호스트네임과 데이터 경로를 인자로 전달하여 실행합니다.
    ```bash
    ./install.sh $(hostname) /mdrm/data
    ```
    > Docker 이미지가 로드되고 컨테이너가 자동으로 실행됩니다.

5.  **접속 및 로그인**
    - 웹 브라우저로 접속하여 정상 동작을 확인합니다.
    - 기본 계정(`mcuser` / `mdrm`)으로 로그인합니다.

---

## **2. 설치 완료 확인**

!!! success "설치 완료 후 웹 브라우저로 접속 가능"
    - MDRM URL : `https://{설치한 서버IP}`
    - 사용자 ID : `mcuser`
    - 비밀번호 : `mdrm`
    
    ![Login Screen](../assets/images/day1/login.png){: width="100%" }

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
