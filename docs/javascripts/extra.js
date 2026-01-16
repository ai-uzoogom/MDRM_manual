// MDRM 교육매뉴얼 커스텀 JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 헤더에 부제목 추가
    addHeaderSubtitle();


    // 진행 상태 점 추가 (제거됨)
    // addProgressIndicator();

    // 현재 페이지에 맞는 탭 하이라이트
    highlightActiveTab();

    // 탭 아래 흰색 영역 제거
    removeWhiteArea();
});

// 헤더에 부제목 추가
function addHeaderSubtitle() {
    // 헤더 타이틀 컨테이너 찾기
    const headerTopic = document.querySelector('.md-header__topic');

    if (!headerTopic) {
        console.log('Header topic not found');
        return;
    }

    // 이미 부제목이 있으면 스킵
    if (document.querySelector('.header-subtitle')) return;

    const subtitle = document.createElement('span');
    subtitle.className = 'header-subtitle';
    subtitle.textContent = ' - 시스템 설치부터 운영까지 완벽 가이드';
    subtitle.style.cssText = 'font-size: 0.7rem; font-weight: 400; opacity: 0.85; color: rgba(255,255,255,0.9);';

    // 제목 텍스트 찾기
    const titleText = headerTopic.querySelector('.md-ellipsis');
    if (titleText) {
        titleText.appendChild(subtitle);
    }
}

// 탭 아래 흰색 영역 제거
function removeWhiteArea() {
    const tabs = document.querySelector('.md-tabs');
    if (tabs) {
        tabs.style.marginBottom = '0';
        tabs.style.paddingBottom = '0';
    }

    const main = document.querySelector('.md-main__inner');
    if (main) {
        main.style.marginTop = '0';
        main.style.paddingTop = '0';
    }
}


// 현재 페이지에 맞는 탭 하이라이트
function highlightActiveTab() {
    const path = window.location.pathname;
    const tabs = document.querySelectorAll('.md-tabs__link');

    tabs.forEach(tab => {
        const href = tab.getAttribute('href');
        if (!href) return;

        // 현재 경로와 탭 href 비교
        if (path.includes(href.replace('./', ''))) {
            tab.classList.add('active-tab');
            tab.style.background = '#2563eb';
            tab.style.color = 'white';
            tab.style.borderColor = '#2563eb';
        }
    });
}
