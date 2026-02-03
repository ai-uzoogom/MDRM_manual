# 🛠️ OS 튜닝

!!! info "학습 안내"
    MDRM의 안정적인 운영을 위해 필요한 커널 파라미터 최적화와 사용자 리소스 제한 설정 방법을 학습합니다.

MDRM의 안정적인 운영을 위해서는 대량의 데이터 처리와 컨테이너 환경을 뒷받침할 수 있는 OS 차원의 튜닝이 필수적입니다. 커널 파라미터(System-wide)와 사용자 리소스 제한(Per-user) 설정을 진행합니다.

---

## **1. 커널 파라미터 설정 (`sysctl.conf`)**

리눅스 커널의 기본 설정값은 컨테이너 기반의 대규모 애플리케이션을 구동하기에 부족할 수 있습니다. `/etc/sysctl.conf` 파일을 수정하여 시스템 전체의 한도를 확장해 주십시오.

| 파라미터 항목 | 권장값 | 설명 |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;">`vm.max_map_count`</span> | `262144` | 프로세스가 가질 수 있는 메모리 맵 영역의 최대 개수입니다. Elasticsearch 등 데이터베이스 컨테이너 구동 시 필수 설정 사항입니다. |
| <span style="white-space: nowrap;">`fs.file-max`</span> | `65536` | 시스템 전체에서 동시에 열 수 있는 파일 핸들의 최대 개수입니다. |

### **1.1 설정 적용 방법**

```bash
# 1. 설정 파일 편집
vi /etc/sysctl.conf

# 2. 파일 하단에 내용 추가
vm.max_map_count = 262144
fs.file-max = 65536

# 3. 변경 사항 즉시 적용 (재부팅 불필요)
sysctl -p
```

---

## **2. 사용자 리소스 제한 설정 (`limits.conf`)**

Docker 및 Podman과 같은 컨테이너 런타임은 실행 시 사용자 레벨의 리소스 제한(ulimit) 영향을 받습니다. 대규모 환경에서는 파일 오픈 개수나 프로세스 생성 개수 제한에 걸려 오류가 발생할 수 있으므로 이를 충분히 늘려주어야 합니다.

`/etc/security/limits.conf` 파일을 수정하여 모든 사용자(`*`)에 대한 제한을 해제합니다.

### **2.1 설정 적용 방법**

```bash
# 1. 설정 파일 편집
vi /etc/security/limits.conf

# 2. 파일 하단에 내용 추가
# 파일 오픈(nofile) 및 프로세스(nproc) 제한 해제
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
```

!!! info "설정 적용 시점"
    `limits.conf`의 변경 사항은 **새로운 세션**부터 적용됩니다. 설정을 마친 후에는 반드시 **로그아웃 후 다시 로그인**하거나 시스템을 재부팅해 주십시오.

---

<div class="next-step-card-container" markdown>
<a href="../인프라_포트_정보/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🛡️ 포트 정보</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
