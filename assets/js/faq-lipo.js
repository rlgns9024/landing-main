(function ($) {
    'use strict';

    var SELECTOR_SECTION = '.faq-lipo';
    var SELECTOR_ITEM = '.faq-lipo-item';
    var SELECTOR_TRIGGER = '.faq-lipo-trigger';
    var SELECTOR_PANEL = '.faq-lipo-panel';
    var CLASS_OPEN = 'is-open';
    var DURATION = 320;

    $(function () {
        var $section = $(SELECTOR_SECTION);
        if (!$section.length) return;

        $section.find(SELECTOR_PANEL).attr('aria-hidden', 'true');

        $section.find(SELECTOR_TRIGGER).on('click', function () {
            var $btn = $(this);
            var $item = $btn.closest(SELECTOR_ITEM);
            var $panel = $item.find(SELECTOR_PANEL);
            var isOpen = $item.hasClass(CLASS_OPEN);
            var $others = $section.find(SELECTOR_ITEM + '.' + CLASS_OPEN).not($item);

            $others.removeClass(CLASS_OPEN);
            $others.find(SELECTOR_TRIGGER).attr('aria-expanded', 'false');
            $others.find(SELECTOR_PANEL).stop(true, true).slideUp(DURATION);
            $others.find(SELECTOR_PANEL).attr('aria-hidden', 'true');

            if (isOpen) {
                $item.removeClass(CLASS_OPEN);
                $btn.attr('aria-expanded', 'false');
                $panel.stop(true, true).slideUp(DURATION);
                $panel.attr('aria-hidden', 'true');
            } else {
                $item.addClass(CLASS_OPEN);
                $btn.attr('aria-expanded', 'true');
                $panel.attr('aria-hidden', 'false');
                $panel.stop(true, true).slideDown(DURATION);
            }
        });
    });
})(jQuery);
