# 🔒 공인 인증서 사용 가이드

!!! info "가이드 대상 버전"
    이 문서는 **MDRM v4.6.2.4 이상** 버전을 기준으로 작성되었습니다. NGINX와 Tomcat 두 곳 모두 설정이 필요합니다.
    
    *   **원본 문서**: [MDRM 4.6.2.4+ 공인 인증서 등록방법](https://mantech.jira.com/wiki/spaces/MDRM/pages/3987800068/MDRM+4.6.2.4+4.6.2.)

---

## **1. 사전 준비**

MDRM에 인증서를 적용하기 위해 다음 파일들이 필요합니다.

| 서비스 | 컨테이너 | 파일 형식 | 비고 |
| :--- | :--- | :--- | :--- |
| **Proxy** | `nginx-gateway` | `.pem` 또는 `.crt` + `.key` | `fullchain.pem` (인증서), `privkey.pem` (개인키) |
| **WAS** | `gam` | `.jks` 또는 `.p12` | Keystore 파일 |

### **예제 환경 값**

본 가이드에서는 다음 값을 사용하여 예제를 진행합니다.

*   **NGINX**
    *   인증서 파일: `pullchain.pem`
    *   개인키 파일: `privkey.pem`
*   **Tomcat (GAM)**
    *   Keystore 파일: `mantech.co.kr.jks`
    *   Keystore 비밀번호: `mantech7790`
*   **MDRM 설치 경로**: `/opt`

---

## **2. NGINX 인증서 설정**

NGINX Gateway(Reverse Proxy)에 SSL 인증서를 적용합니다.

### **2.1 인증서 파일 준비**

인증서 및 개인키 파일을 호스트의 매핑 경로(`/opt/config/ssl/`)에 위치시킵니다.
이 경로는 컨테이너 내부의 `/gampkgs/ssl/` 경로와 매핑되어 있습니다.

!!! tip "비밀번호 파일"
    비밀번호가 있는 인증서일 경우, 비밀번호가 적힌 텍스트 파일(예: `ssl_passwords.txt`)도 함께 해당 경로에 위치시킵니다.

### **2.2 설정 파일 수정**

1. `nginx-gateway` 컨테이너에 접속합니다.
    ```bash
    docker exec -it nginx-gateway bash
    ```

2. NGINX 환경 설정 파일을 엽니다.
    ```bash
    vi /etc/nginx/conf.d/nginx.conf
    ```

3. `server` 블록의 SSL 관련 설정을 수정합니다.

    **[변경 전 (Before)]**
    ```nginx
    server {
        listen 443 ssl; 
        ssl_certificate /gampkgs/ssl/mdrm.crt; 
        ssl_certificate_key /gampkgs/ssl/mdrm.key; 
        # ...
    }
    ```

    **[변경 후 (After)]**
    ```nginx
    server {
        listen 443 ssl; 
        # 공인 인증서 파일 지정
        ssl_certificate /gampkgs/ssl/pullchain.pem;    
        ssl_certificate_key /gampkgs/ssl/privkey.pem;
        
        # (선택) 비밀번호가 있는 인증서일 경우 추가
        ssl_password_file /gampkgs/ssl/ssl_passwords.txt; 
    
        location /workflow-controller/ { 
            proxy_pass https://workflow-controller:9080/; 
        }
    }
    ```

4. 컨테이너를 나와서 `nginx-gateway`를 재시작합니다.
    ```bash
    exit
    docker restart nginx-gateway
    ```

---

## **3. Tomcat 인증서 설정**

MDRM 웹 애플리케이션 서버(Tomcat)에 SSL 인증서를 적용합니다.

### **3.1 인증서 파일 준비**

Tomcat용 Keystore 파일(`.jks` 또는 `.p12`)을 호스트의 매핑 경로(`/opt/config/ssl/`)에 위치시킵니다.

### **3.2 설정 파일 수정**

1. `gam` 컨테이너에 접속합니다.
    ```bash
    docker exec -it gam bash
    ```

2. Tomcat `server.xml` 파일을 엽니다.
    ```bash
    vi /gampkgs/data/tomcat/8.5/conf/server.xml
    ```

3. `<Connector port="443" ... />` 부분을 찾아 `keystoreFile`, `keystorePass` 속성을 수정합니다.
   (약 44라인 부근)

    **[변경 전 (Before)]**
    ```xml
    <Connector port="443" protocol="HTTP/1.1" scheme="https" secure="true" SSLEnabled="true" 
        keystoreFile="/gampkgs/ssl/certificate.p12" 
        keystorePass="password" 
        clientAuth="false" sslProtocol="TLS"/>
    ```

    **[변경 후 (After)]**
    ```xml
    <Connector port="443" protocol="HTTP/1.1" scheme="https" secure="true" SSLEnabled="true" 
        keystoreFile="/gampkgs/ssl/mantech.co.kr.jks" 
        keystorePass="mantech7790" 
        clientAuth="false" sslProtocol="TLS"/>
    ```
    
    *   **keystoreFile**: 컨테이너 내부 경로인 `/gampkgs/ssl/` 아래의 파일명을 사용해야 합니다.
    *   **keystorePass**: 인증서 발급 시 설정한 비밀번호를 입력합니다.

4. `gam` 컨테이너 내부에서 Tomcat을 재시작합니다.
    ```bash
    service tomcat8 restart
    ```

---

## **4. 설정 확인**

브라우저를 열고 MDRM 웹 콘솔에 접속(`https://{MDRM_SERVER}`)하여, 주소창의 자물쇠 아이콘을 클릭합니다.
인증서 뷰어를 통해 발급된 공인 인증서 정보가 올바르게 표시되는지 확인합니다.

!!! success "확인 사항"
    *   인증서 발급 대상(Common Name)이 일치하는가?
    *   유효 기간이 정상적으로 표시되는가?
    *   콘솔 접속 시 보안 경고가 발생하지 않는가?
