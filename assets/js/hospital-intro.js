(function ($) {
    'use strict';

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

    function setTabActive(index) {
        $tabs.removeClass('is-active').attr('aria-selected', 'false');
        $tabs.filter('[data-hospital-tab="' + index + '"]').addClass('is-active').attr('aria-selected', 'true');
    }

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





    function bindMobileUi() {
        if (uiBound || !$section.length) return;
        $mainImg = $('#hospitalIntroMainImg');
        $tabs = $section.find('.hospital-intro-tab');
        $thumbs = $('#hospitalIntroThumbs');
        if (!$mainImg.length || !$tabs.length || !$thumbs.length) return;

        $mainImg.css('opacity', 1);

        $tabs.on('click.hospitalIntro', function () {
            var idx = parseInt($(this).attr('data-hospital-tab'), 10);
            if (isNaN(idx) || idx < 0 || idx >= HOSPITAL_DATA.length) return;
            if (idx === currentTab) return;
            syncMain(idx, 0);
        });

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
