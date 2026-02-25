# 🔑 임시 라이선스 입력

!!! info "학습 안내"
    MDRM 설치 직후, 원활한 실습 진행을 위해 시스템에 부여된 실습용 임시 라이선스를 등록하는 과정입니다.

## **1. 라이선스 키 정보**

아래의 임시 라이선스 키 블록 전체를 복사(`Ctrl + C` 또는 우측 상단의 📋 버튼 클릭)하여, MDRM 관리 콘솔의 [시스템] > [라이선스 등록] 메뉴에 붙여넣고 저장해주십시오.

```text title="MDRM 교육용 임시 라이선스"
HOST localhost ANY 5053
ISV mantech port=5055
LICENSE mantech mdrm 4 11-may-2026 30 min_timeout=60 _ck=91083287a6
sig="c2N252zwy6w4ZPHI9iLtaUuUuFg3aByQ0igy=Fp4MrJjVp7i0QZfcTRF5ykoBN
"
```

!!! tip "주의사항"
    `sig=` 항목 마지막의 들여쓰기된 큰따옴표(`"`) 기호까지 전부 누락 없이 복사되어야 라이선스가 정상적으로 인식됩니다. 등록을 마치면 메인 메뉴가 정상적으로 활성화됩니다!

---

<center>
    <p style="opacity: 0.5; font-size: 0.8rem;">
        이것으로 <strong>MDRM 설치 및 운영</strong> 파트의 교육 단계를 마칩니다. 수고하셨습니다!
    </p>
</center>

---

<div class="next-step-card-container" markdown>
<a href="../../part2/MDRM_PART2_학습_안내/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">📋 PART 2: 운영 환경 구성 및 자원 관리</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
