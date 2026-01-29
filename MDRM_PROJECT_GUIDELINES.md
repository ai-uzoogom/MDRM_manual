# 📘 MDRM 교육 매뉴얼 프로젝트 가이드 (AI 협업용)

이 문서는 MDRM 교육 매뉴얼의 일관된 품질과 스타일을 유지하기 위해 작성되었습니다. 다른 AI 도구나 새로운 대화 창에서 작업을 이어갈 때 이 가이드를 반드시 참고하십시오.

---

### **1. 핵심 톤앤매너 (Tone & Manner)**
*   **어투**: 반드시 **친절한 경어체(~합니다, ~입니다)**를 사용합니다. 
*   **대상**: 시스템 엔지니어 및 기술 교육 수강생.
*   **원칙**: 전문적이되 딱딱하지 않게, 핵심을 명확하게 전달합니다.

### **2. 페이지 표준 구조**
모든 마크다운(.md) 문서는 다음 구조를 엄격히 준수합니다.

1.  **메인 제목**: `# 🚀 주제명` (적절한 이모지 포함)
2.  **요약/목표 박스**: 
    ```markdown
    !!! info "학습 안내"
        이 페이지의 목적과 학습할 내용을 2~3줄로 요약 기술합니다.
    ```
3.  **본문 섹션**: `## **1. 섹션 제목**` (번호 + 굵은 글씨 조합)
4.  **다음 단계 카드 (Next Step)**: 페이지 최하단에 배치 (아래 코드 참조)

### **3. 주요 스타일 속성**
*   **강조/주의**: `!!! danger` (절대 주의), `!!! warning` (주의), `!!! tip` (꿀팁), `!!! example` (예시)
*   **다이어그램**: 프로세스 설명 시 `mermaid` 차트를 적극 활용합니다.
*   **가독성**: 긴 문장보다는 불렛 포인트와 테이블을 선호합니다.

### **4. 기술적 규칙 (Technical Rules)**
*   **인증 코드**: 일반 사용자 초기 접속 코드는 **`TEST`** (대문자)입니다.
*   **보안 파일**: `docs/javascripts/extra.js`가 전역 인증 및 암호화를 담당하므로 수정 시 주의하십시오.
*   **특수 폴더**: 
    *   `docs/troubleshooting/`: 실무 예외 사례 보관.
    *   `.agent/workflows/`: 작업 절차 표준화 문서 보관.

### **5. 다음 단계 카드 코드 스니펫**
```markdown
<div class="next-step-card-container" markdown>
<a href="../대상_경로/" class="next-step-card">
    <span class="next-content">
        <span class="next-step-label">Next Step</span>
        <span class="next-step-title">다음 페이지 제목</span>
    </span>
    <span class="next-step-icon">→</span>
</a>
</div>
```

---
**최종 업데이트**: 2026-01-29
**작성자**: Antigravity (Google Deepmind)
