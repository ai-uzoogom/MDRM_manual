# 🧪 LAB 실습 환경 안내

!!! info "학습 안내"
    MDRM 교육 과정을 원활하게 진행하기 위해 교육생별로 할당된 가상 머신(VM) 및 네트워크 정보를 확인합니다. 모든 실습은 본 가이드에 기재된 IP 대역 내에서 이루어집니다.

---

## **1. 교육장 Wi-Fi 접속 안내**

선행 실습을 위해 교육장에 마련된 전용 무선 네트워크(Wi-Fi)에 먼저 접속해주시기 바랍니다. 스마트폰 또는 노트북 웹캠 등을 통해 아래 QR 코드를 스캔하시면 간편하게 연결할 수 있습니다.

<div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
  <img src="../../assets/images/lab/MantechSolutionAP.png" alt="Wi-Fi AP QR Code" style="max-height: 220px; border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--custom-shadow);" />
  <div style="font-size: 1rem; text-align: left; padding: 20px; background: var(--custom-bg-light, #f8f9fa); border: 1px solid var(--border, #e5e7eb); border-radius: 8px;">
    <div style="margin-bottom: 12px;"><strong>📡 SSID</strong><br><code style="font-size: 1.1em; color: var(--md-code-fg-color);">Guest-5G-MantechSolution</code></div>
    <div><strong>🔑 Password</strong><br><code style="font-size: 1.1em; color: var(--md-code-fg-color);">M@ntechGuest</code></div>
  </div>
</div>

---

## **2. 실습 환경 구성 및 IP 할당 현황**

교육을 위해 각 교육생에게는 총 3대의 전용 가상 머신(VM)이 제공됩니다. **화면 최상단 우측의 교육생 선택 메뉴**에서 본인의 이름을 선택하면, 이 후 진행되는 모든 매뉴얼에 기재된 기본 IP(`10.20.33.x`)가 **본인의 실제 실습 IP로 자동 변환**되어 나타납니다.

<div id="student-table-placeholder" style="padding: 20px; text-align: center; background: var(--custom-bg-light, #f8f9fa); border: 1px dashed var(--md-primary-fg-color, #ccc); border-radius: 8px; margin-bottom: 20px; color: var(--md-default-fg-color--light);">
    👉 <strong>화면 최상단 우측에서 본인의 이름을 먼저 선택해 주세요.</strong><br>선택 시 할당된 인프라 호스트 접속 정보가 이곳에 나타납니다.
</div>

<div class="student-table-container" style="display: none;" markdown="1">

| 교육생 이름 | 서버 구분 | IP 주소 | 접속 계정 | 비밀번호 |
| :--- | :--- | :--- | :--- | :--- |{% for student in extra.lab.students %}
| **{{ student }}**<br>(IP 대역: {{ extra.lab.base_ip + loop.index }}) | **MDRM** (통합 관리 서버)<br>**WINDOWS** (Agent 대상)<br>**LINUX** (Agent 대상) | `10.20.{{ extra.lab.base_ip + loop.index }}.100`<br>`10.20.{{ extra.lab.base_ip + loop.index }}.101`<br>`10.20.{{ extra.lab.base_ip + loop.index }}.102` | `root`<br>`administrator`<br>`root` | `password` |{% endfor %}

</div>

---

!!! success "준비 완료"
    자신의 IP 대역에 정상적으로 접속되는 것을 확인했다면, **설치** 학습으로 이동하여 인프라 구성을 시작하세요!

<div class="next-step-card-container" markdown>
<a href="../../setup/MDRM_설치_학습_안내/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🚀 설치: 인프라 구성 시작</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
