# 🛑 정지 및 종료

!!! info "학습 안내"
    MDRM 서비스를 안전하게 중지하거나 완전히 종료하는 방법을 학습하고, `stop`과 `down` 명령어의 기술적 차이점을 이해합니다.

## **1. 명령어 실행 전 확인 사항**

!!! info "중요: 명령어 실행 위치"
    `docker compose` 구문은 `docker-compose.yml` 파일이 존재하는 디렉토리에서 실행해야 합니다.
    
    * **기본 설치 경로**: `{{ extra.mdrm.bin_path }}/`
    * **실행 예시**: 
      ```bash
      cd {{ extra.mdrm.bin_path }}
      docker compose stop
      ```

---

## **2. docker compose stop vs down 의 차이점**

!!! danger "명령어 선택 시 주의사항"
    작업 용도에 따라 적절한 명령어를 선택하여 수행해야 합니다.

### **2.1 docker compose stop**

```bash
docker compose stop
```

| 특징 | 설명 |
|:---|:---|
| 동작 | 실행 중인 컨테이너를 **일시 정지**합니다. |
| 데이터 | 컨테이너 설정 및 내부 데이터가 그대로 **보존됩니다.** |
| 재시작 | 정지된 상태에서 빠르게 서비스를 복구할 수 있습니다. |

!!! tip "권장 사용 시나리오"
    - 시스템을 잠시 중지해야 하는 경우
    - 서버를 재부팅하기 전
    - 빠른 서비스 재시작이 필요한 경우

---

### **2.2 docker compose down**

```bash
docker compose down
```

| 특징 | 설명 |
|:---|:---|
| 동작 | 컨테이너를 정지한 후 **완전히 삭제**합니다. |
| 네트워크 | 생성되었던 가상 네트워크를 함께 **제거**합니다. |
| 볼륨 | 별도의 옵션을 지정하지 않으면 데이터 볼륨은 **유지됩니다.** |

!!! danger "수행 시 주의사항"
    - 컨테이너가 시스템에서 완전히 삭제되므로, 다시 시작할 때 새 컨테이너가 생성됩니다.
    - 볼륨 데이터는 기본적으로 보존되지만, `-v` 옵션을 함께 사용하면 모든 데이터가 삭제되므로 주의하십시오.

!!! tip "권장 사용 시나리오"
    - 시스템 버전을 업그레이드하는 경우
    - 설정 변경으로 인해 완전한 재설치가 필요한 경우
    - 컨테이너 환경을 완전히 초기화하고 싶은 경우

---

## **3. 명령어 비교 요약**

| 명령어 | 컨테이너 상태 | 네트워크 | 볼륨 데이터 | 재시작 속도 |
|:---|:---:|:---:|:---:|:---:|
| `stop` | 정지 (유지) | 유지 | 유지 | 빠름 |
| `down` | 삭제 | 삭제 | 유지* | 느림 |

<small>* `-v` 옵션을 사용하면 볼륨 데이터도 함께 삭제됩니다.</small>

---

<div class="next-step-card-container" markdown>
<a href="../MDRM_시스템_관리/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🛠️ 시스템 상태 확인 및 관리</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
