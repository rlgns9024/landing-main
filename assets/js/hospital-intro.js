/**
 * 병원 소개 (#section-16) — 모바일(768px 이하) 전용 인터랙션
 * - 탭 전환 시 메인 이미지 페이드
 * - 썸네일 가로 스크롤(터치 스와이프) + 클릭 시 메인 동기화
 * 의존: jQuery
 */
(function ($) {
    'use strict';

    /** [데이터] 탭(로비/접수 · 상담/대기 · 시술/대기)별 이미지 배열 — 경로·문구는 필요 시 여기만 수정 */
    var HOSPITAL_DATA = [
        {
            images: [
                { src: 'assets/images/sec16-1.webp', alt: '세이프라인 성형외과 접수 데스크' },
                { src: 'assets/images/sec16-2.webp', alt: 'SAFELINE PLASTIC SURGERY' }
            ]
        },
        {
            images: [
                { src: 'assets/images/sec16-3.webp', alt: '상담실' },
                { src: 'assets/images/sec16-5.webp', alt: '대기 라운지' }
            ]
        },
        {
            images: [
                { src: 'assets/images/sec16-4.webp', alt: '수술실' },
                { src: 'assets/images/sec16-6.webp', alt: '회복실' }
            ]
        }
    ];

    var mq = window.matchMedia('(max-width: 768px)');
    var $section;
    var $mainImg;
    var $tabs;
    var $thumbs;
    var uiBound = false;
    var currentTab = 0;
    var currentThumb = 0;

    /** [메인 이미지] 페이드 아웃 → src 교체 → 페이드 인 */
    function showImageInMain(src, alt) {
        if (!$mainImg || !$mainImg.length) return;
        $mainImg.stop(true, true);
        var fadedIn = false;
        function fadeInOnce() {
            if (fadedIn) return;
            fadedIn = true;
            $mainImg.animate({ opacity: 1 }, 220);
        }
        $mainImg.animate({ opacity: 0 }, 200, function () {
            $mainImg.off('load.hospitalIntro');
            $mainImg.one('load.hospitalIntro', fadeInOnce);
            $mainImg.attr('src', src).attr('alt', alt);
            if ($mainImg[0].complete) {
                fadeInOnce();
            }
            setTimeout(fadeInOnce, 500);
        });
    }

    /** [탭 UI] 활성 탭: 파란 배경(is-active), aria-selected 동기화 */
    function setTabActive(index) {
        $tabs.removeClass('is-active').attr('aria-selected', 'false');
        $tabs.filter('[data-hospital-tab="' + index + '"]').addClass('is-active').attr('aria-selected', 'true');
    }

    /** [썸네일 영역] 현재 탭의 이미지로 버튼 목록 재구성 */
    function renderThumbs(tabIndex, activeLocalIndex) {
        var list = HOSPITAL_DATA[tabIndex].images;
        var parts = [];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var activeClass = i === activeLocalIndex ? ' is-active' : '';
            parts.push(
                '<button type="button" class="hospital-thumb' +
                    activeClass +
                    '" role="listitem" data-local-index="' +
                    i +
                    '">' +
                    '<img src="' +
                    item.src +
                    '" alt="" width="160" height="129" loading="lazy" decoding="async">' +
                    '</button>'
            );
        }
        $thumbs.html(parts.join(''));
    }

    /** 탭·썸네일·메인을 한 번에 맞춤 (instant: 첫 진입 등 페이드 생략) */
    function syncMain(tabIndex, localIndex, instant) {
        var row = HOSPITAL_DATA[tabIndex].images[localIndex];
        currentTab = tabIndex;
        currentThumb = localIndex;
        setTabActive(tabIndex);
        renderThumbs(tabIndex, localIndex);
        if (instant && $mainImg && $mainImg.length) {
            $mainImg.stop(true, true).css('opacity', 1).attr('src', row.src).attr('alt', row.alt);
        } else {
            showImageInMain(row.src, row.alt);
        }
    }

    /** [초기화] 모바일 뷰에서만 이벤트 바인딩 */
    function bindMobileUi() {
        if (uiBound || !$section.length) return;
        $mainImg = $('#hospitalIntroMainImg');
        $tabs = $section.find('.hospital-intro-tab');
        $thumbs = $('#hospitalIntroThumbs');
        if (!$mainImg.length || !$tabs.length || !$thumbs.length) return;

        $mainImg.css('opacity', 1);

        /** [탭 클릭] 해당 카테고리 첫 번째 사진부터 표시 */
        $tabs.on('click.hospitalIntro', function () {
            var idx = parseInt($(this).attr('data-hospital-tab'), 10);
            if (isNaN(idx) || idx < 0 || idx >= HOSPITAL_DATA.length) return;
            if (idx === currentTab) return;
            syncMain(idx, 0);
        });

        /** [썸네일 클릭] 위임: 선택한 썸네일을 메인에 반영 */
        $thumbs.on('click.hospitalIntro', '.hospital-thumb', function () {
            var local = parseInt($(this).attr('data-local-index'), 10);
            if (isNaN(local)) return;
            var row = HOSPITAL_DATA[currentTab].images[local];
            currentThumb = local;
            $thumbs.find('.hospital-thumb').removeClass('is-active');
            $(this).addClass('is-active');
            showImageInMain(row.src, row.alt);
        });

        syncMain(0, 0, true);
        uiBound = true;
    }

    /** 리사이즈로 PC 복귀 시 이벤트 제거 */
    function unbindMobileUi() {
        if (!uiBound) return;
        if ($tabs && $tabs.length) $tabs.off('click.hospitalIntro');
        if ($thumbs && $thumbs.length) $thumbs.off('click.hospitalIntro');
        if ($mainImg && $mainImg.length) {
            $mainImg.stop(true, true).css('opacity', 1).off('load.hospitalIntro');
        }
        uiBound = false;
    }

    function applyBreakpoint() {
        if (mq.matches) {
            unbindMobileUi();
            bindMobileUi();
        } else {
            unbindMobileUi();
        }
    }

    $(function () {
        $section = $('#section-16');
        if (!$section.length) return;

        applyBreakpoint();

        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', applyBreakpoint);
        } else if (typeof mq.addListener === 'function') {
            mq.addListener(applyBreakpoint);
        }
    });
})(jQuery);
