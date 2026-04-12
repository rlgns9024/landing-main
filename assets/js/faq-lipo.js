/**
 * 지방흡입 FAQ 아코디언
 * - 한 번에 하나만 열림(다른 항목은 부드럽게 닫힘)
 * - jQuery slideDown / slideUp
 */
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

        /** 초기: 패널 숨김 상태를 스크린리더에도 반영 */
        $section.find(SELECTOR_PANEL).attr('aria-hidden', 'true');

        $section.find(SELECTOR_TRIGGER).on('click', function () {
            var $btn = $(this);
            var $item = $btn.closest(SELECTOR_ITEM);
            var $panel = $item.find(SELECTOR_PANEL);
            var isOpen = $item.hasClass(CLASS_OPEN);
            var $others = $section.find(SELECTOR_ITEM + '.' + CLASS_OPEN).not($item);

            /** [닫기] 이미 열려 있던 다른 질문들 */
            $others.removeClass(CLASS_OPEN);
            $others.find(SELECTOR_TRIGGER).attr('aria-expanded', 'false');
            $others.find(SELECTOR_PANEL).stop(true, true).slideUp(DURATION);
            $others.find(SELECTOR_PANEL).attr('aria-hidden', 'true');

            if (isOpen) {
                /** [토글] 같은 질문 다시 클릭 시 닫기 */
                $item.removeClass(CLASS_OPEN);
                $btn.attr('aria-expanded', 'false');
                $panel.stop(true, true).slideUp(DURATION);
                $panel.attr('aria-hidden', 'true');
            } else {
                /** [열기] 선택한 질문만 슬라이드 다운 */
                $item.addClass(CLASS_OPEN);
                $btn.attr('aria-expanded', 'true');
                $panel.attr('aria-hidden', 'false');
                $panel.stop(true, true).slideDown(DURATION);
            }
        });
    });
})(jQuery);
