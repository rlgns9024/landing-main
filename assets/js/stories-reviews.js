(function ($) {
    'use strict';

    var section = $('#storiesReviews');
    if (!section.length) return;





    var STORIES_MODELS = [
        {
            main: 'assets/images/sec10-1.webp',
            subTop: 'assets/images/sec10-2.webp',
            subBottom: 'assets/images/sec10-3.webp',
            thumb: 'assets/images/sec10-4.webp',
            name: '민**님',
            area: '바디 라인',
            quoteHtml:
                '단순히 지방을 빼는 게 아니라<br>라인을 어떻게 만들어야 하는지<br>설명해주셔서 좋았어요.<br>관리까지 같이 진행되니까<br>결과가 더 만족스럽습니다.'
        },
        {
            main: 'assets/images/model2-1.webp',
            subTop: 'assets/images/model2-2.webp',
            subBottom: 'assets/images/model2-3.webp',
            thumb: 'assets/images/model2-2.webp',
            name: '김**님',
            area: '팔·겨드랑이 흡입',
            quoteHtml:
                '운동으로도 빠지지 않던 라인이 정리돼서<br>옷 핏이 달라졌어요.<br>상담 때부터 꼼꼼하게 잡아주셔서 믿고 맡겼습니다.'
        },
        {
            main: 'assets/images/model3-1.webp',
            subTop: 'assets/images/model3-2.webp',
            subBottom: 'assets/images/model3-3.webp',
            thumb: 'assets/images/model3-2.webp',
            name: '박**님',
            area: '등·브라라인',
            quoteHtml:
                '뒤태 라인이 고민이었는데<br>전체적으로 균형 있게 잡혀서 만족해요.<br>회복 과정도 친절히 안내해 주셨습니다.'
        },
        {
            main: 'assets/images/model1-1.webp',
            subTop: 'assets/images/model1-2.webp',
            subBottom: 'assets/images/model1-3.webp',
            thumb: 'assets/images/model1-2.webp',
            name: '이 **님',
            area: '복부 허벅지흡입',
            quoteHtml: '과하게 빠진 느낌이 아니라 전체적으로 비율이 좋아진 느낌이라 더 만족스러워요 ㅎㅎ'
        }
    ];

    var SLIDE_COUNT = STORIES_MODELS.length;
    var current = 0;

    var $fadeRoot = $('#storiesCollageFade');
    var $mainImg = $('#storiesMainImg');
    var $subTop = $('#storiesSubImgTop');
    var $subBottom = $('#storiesSubImgBottom');
    var $quote = section.find('.stories-quote-text');
    var $name = section.find('.stories-profile-name');
    var $area = section.find('.stories-profile-area');
    var $previews = section.find('.stories-preview');
    var $dots = section.find('.stories-dot');
    var $btnPrev = section.find('.stories-nav-prev');
    var $btnNext = section.find('.stories-nav-next');
    var $quoteTop = section.find('.stories-highlight-top');

    var FADE_MS = 220;





    function applyModelToDom(model, skipFade) {
        $name.text(model.name);
        $area.text(model.area);
        $quote.html(model.quoteHtml);

        function swapImageSrc() {
            $mainImg.attr('src', model.main);
            $subTop.attr('src', model.subTop);
            $subBottom.attr('src', model.subBottom);
        }

        if (skipFade) {
            swapImageSrc();
            return;
        }

        $fadeRoot.stop(true).animate({ opacity: 0 }, FADE_MS, function () {
            swapImageSrc();
            $fadeRoot.animate({ opacity: 1 }, FADE_MS);
        });
    }

    function goTo(index, options) {
        var opts = options || {};
        var n = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
        current = n;

        var model = STORIES_MODELS[n];
        if (!model) return;

        applyModelToDom(model, !!opts.skipFade);

        $previews.each(function () {
            var i = parseInt($(this).attr('data-slide-index'), 10);
            $(this).toggleClass('is-active', i === n);
        });

        $dots.each(function () {
            var i = parseInt($(this).attr('data-slide-index'), 10);
            $(this).toggleClass('is-active', i === n);
        });
    }

    function next() {
        goTo(current + 1);
    }

    function prev() {
        goTo(current - 1);
    }





    $previews.on('click', function () {
        var i = parseInt($(this).attr('data-slide-index'), 10);
        if (!isNaN(i)) goTo(i);
    });

    $dots.on('click', function () {
        var i = parseInt($(this).attr('data-slide-index'), 10);
        if (!isNaN(i)) goTo(i);
    });

    $btnPrev.on('click', prev);
    $btnNext.on('click', next);

    $quoteTop.on('click', function () {
        if (window.matchMedia('(max-width: 1024px)').matches) {
            next();
        }
    });

    goTo(0, { skipFade: true });
})(jQuery);
