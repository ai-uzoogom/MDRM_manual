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

교육을 위해 각 교육생에게는 총 3대의 전용 가상 머신(VM)이 제공됩니다. 아래 목록에서 자신의 번호에 할당된 3번째 IP 대역(`xx`)과 세부 접속 정보를 확인해 주세요.

| 교육생 번호 | IP 대역 | 서버 구분 | IP 주소 | 접속 계정 | 비밀번호 |
| :--- | :---: | :--- | :--- | :--- | :--- |{% for i in range(1, extra.lab.student_count + 1) %}
| **교육생 {{ i }}** | <span class="custom-badge-blue">**{{ 110 + i }}**</span> | **MDRM** (통합 관리 서버)<br>**WINDOWS** (Agent 대상)<br>**LINUX** (Agent 대상) | `10.20.{{ 110 + i }}.100`<br>`10.20.{{ 110 + i }}.101`<br>`10.20.{{ 110 + i }}.102` | `root`<br>`administrator`<br>`root` | `password` (공통) |{% endfor %}

---

!!! success "준비 완료"
    자신의 IP 대역에 정상적으로 접속되는 것을 확인했다면, **PART 1** 학습으로 이동하여 인프라 구성을 시작하세요!

<div class="next-step-card-container" markdown>
<a href="../../setup/MDRM_설치_학습_안내/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">🚀 PART 1: 인프라 및 설치 학습 시작</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
