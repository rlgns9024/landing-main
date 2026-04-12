/**
 * 고객 후기 — 슬라이드 전환 (바닐라 JS)
 * PC(1025px~): 왼쪽 3장 트랙, 오른쪽 예고 썸네일 클릭 시 해당 슬라이드
 * 모바일(1024px 이하): 도트 / 인용 영역 탭으로 전환
 */

(function () {
    'use strict';

    var section = document.getElementById('storiesReviews');
    if (!section) return;

    var track = section.querySelector('.stories-collage-track');
    var quoteEl = section.querySelector('.stories-quote-text');
    var previews = section.querySelectorAll('.stories-preview');
    var dots = section.querySelectorAll('.stories-dot');
    var btnPrev = section.querySelector('.stories-nav-prev');
    var btnNext = section.querySelector('.stories-nav-next');
    var quoteTop = section.querySelector('.stories-highlight-top');

    /* ============================================================
       [수정] 슬라이드별 리뷰 HTML — 아래 문자열만 고치면 됩니다. (<br> 사용 가능)
       ============================================================ */
    var QUOTES = [
        '단순히 지방을 빼는 게 아니라<br>라인을 어떻게 만들어야 하는지<br>설명해주셔서 좋았어요.<br>관리까지 같이 진행되니까<br>결과가 더 만족스럽습니다.',
        '두 번째 후기 문구를 여기에 작성해 주세요.',
        '세 번째 후기 문구를 여기에 작성해 주세요.'
    ];

    var SLIDE_COUNT = 3;
    var current = 0;

    function goTo(index) {
        var n = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
        current = n;
        if (track) {
            track.style.transform = 'translateX(' + (-(100 / SLIDE_COUNT) * n) + '%)';
        }
        if (quoteEl) {
            quoteEl.innerHTML = QUOTES[n] || '';
        }
        previews.forEach(function (btn) {
            var i = parseInt(btn.getAttribute('data-slide-index'), 10);
            btn.classList.toggle('is-active', i === n);
        });
        dots.forEach(function (btn) {
            var i = parseInt(btn.getAttribute('data-slide-index'), 10);
            btn.classList.toggle('is-active', i === n);
        });
    }

    function next() {
        goTo(current + 1);
    }

    function prev() {
        goTo(current - 1);
    }

    previews.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var i = parseInt(btn.getAttribute('data-slide-index'), 10);
            if (!isNaN(i)) goTo(i);
        });
    });

    dots.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var i = parseInt(btn.getAttribute('data-slide-index'), 10);
            if (!isNaN(i)) goTo(i);
        });
    });

    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    /* 모바일: 인용 문단 영역 탭 시 다음 슬라이드(화살표는 제외) */
    if (quoteTop) {
        quoteTop.addEventListener('click', function () {
            if (window.matchMedia('(max-width: 1024px)').matches) {
                next();
            }
        });
    }

    goTo(0);
})();
