(function ($) {
    'use strict';

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
