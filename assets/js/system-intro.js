/**
 * #section-11 시스템 소개 — 3초마다 자동 슬라이드 (jQuery)
 * 페이드 + 살짝 위아래 이동, 4번 다음은 1번으로 루프
 */

(function ($) {
    'use strict';

    /* [설정] 자동 전환 간격 — 밀리초. 3000 = 3초 */
    var AUTO_MS = 3000;

    $(function () {
        var $root = $('#section-11');
        if (!$root.length) return;

        var $slides = $root.find('.sys-intro-slide');
        var $fill = $root.find('.sys-intro-progress-fill');
        var $progress = $root.find('.sys-intro-progress');
        var total = $slides.length;
        if (total === 0) return;

        var index = 0;

        /* 슬라이드 인덱스(0~3) → 게이지 너비 25%, 50%, 75%, 100% */
        function setProgress(n) {
            var pct = ((n + 1) / total) * 100;
            $fill.css('width', pct + '%');
            if ($progress.length) {
                $progress.attr('aria-valuenow', String(n + 1));
            }
        }

        function goTo(next) {
            var n = ((next % total) + total) % total;
            $slides.removeClass('is-active');
            $slides.eq(n).addClass('is-active');
            index = n;
            setProgress(n);
        }

        function next() {
            goTo(index + 1);
        }

        goTo(0);

        setInterval(next, AUTO_MS);
    });
})(jQuery);
