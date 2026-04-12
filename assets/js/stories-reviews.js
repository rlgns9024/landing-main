/**
 * 고객 후기 — jQuery + 데이터 배열(STORIES_MODELS)
 * - 원형 프로필(또는 도트·이전/다음)으로 모델 선택 시 왼쪽 이미지 3장 + 이름·부위·후기 텍스트 반영
 * - 이미지 영역은 페이드(opacity)로 부드럽게 전환
 */

(function ($) {
    'use strict';

    var section = $('#storiesReviews');
    if (!section.length) return;

    /* -------------------------------------------------------------------------
       [데이터] 모델별 이미지·프로필·후기 — 유지보수 시 이 배열만 수정하면 됩니다.
       - main: 왼쪽 큰 이미지
       - subTop / subBottom: 오른쪽 위·아래 작은 이미지
       - thumb: 우측 원형 프로필 썸네일(리스트 버튼 안 img의 초기 src와 동일하게 맞추면 깔끔합니다)
       - name, area: 프로필 한 줄 표시
       - quoteHtml: 후기 본문 (<br> 허용)
       ------------------------------------------------------------------------- */
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

    /**
     * 선택된 모델 데이터를 화면에 반영하는 핵심 함수입니다.
     *
     * [동작 순서 요약]
     * 1) 인덱스 n을 0 ~ (모델 수-1) 범위로 맞춥니다.
     * 2) 텍스트(이름·부위·후기)는 즉시 바꿉니다 — 텍스트는 페이드 없이 바로 바뀌어도 읽기에 자연스럽습니다.
     * 3) 이미지 3장은 "페이드 아웃 → src 교체 → 페이드 인" 순서로 바꿔 끊김 없이 보이게 합니다.
     * 4) 우측 원형 프로필·하단 도트에 is-active 클래스를 토글해 선택 상태를 표시합니다.
     */
    function applyModelToDom(model, skipFade) {
        // [텍스트 교체] 이름·부위는 순수 텍스트로 넣고(.text), 후기만 줄바꿈용 <br>을 허용하려 .html 사용
        $name.text(model.name);
        $area.text(model.area);
        $quote.html(model.quoteHtml);

        // [이미지 src 교체] 세 장의 URL을 한 번에 바꿉니다. 페이드와 무관하게 이 함수에서 실제 경로가 갱신됩니다.
        function swapImageSrc() {
            $mainImg.attr('src', model.main);
            $subTop.attr('src', model.subTop);
            $subBottom.attr('src', model.subBottom);
        }

        // [초기 로드·동일 모델 재선택 방지용] 첫 진입 시에는 깜빡임 없이 바로 표시
        if (skipFade) {
            swapImageSrc();
            return;
        }

        // [이미지 페이드 전환] jQuery animate로 opacity만 조절해 GPU 부담을 줄이면서 끊김을 완화합니다.
        // 1단계: opacity 0까지 내린다 → 2단계: 콜백 안에서 swapImageSrc()로 세 img의 src를 바꾼다 → 3단계: opacity 1로 복귀
        $fadeRoot.stop(true).animate({ opacity: 0 }, FADE_MS, function () {
            swapImageSrc();
            $fadeRoot.animate({ opacity: 1 }, FADE_MS);
        });
    }

    function goTo(index, options) {
        var opts = options || {};
        // 인덱스가 범위를 벗어나면 순환(이전/다음 버튼용)
        var n = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
        current = n;

        var model = STORIES_MODELS[n];
        if (!model) return;

        // 최초 로드(goTo(0) 직후)에는 이미 HTML에 첫 모델 이미지가 있으므로 페이드 생략 가능
        applyModelToDom(model, !!opts.skipFade);

        // 원형 프로필: 클릭된 버튼만 is-active → CSS에서 테두리·그림자로 강조
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

    // --- 이벤트: jQuery로 위임/바인딩 ---
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

    /* 모바일: 인용 문단 영역 탭 시 다음 슬라이드(화살표는 제외) */
    $quoteTop.on('click', function () {
        if (window.matchMedia('(max-width: 1024px)').matches) {
            next();
        }
    });

    // 첫 화면: STORIES_MODELS[0] 기준으로 이름·부위·후기·활성 표시를 맞추고, 이미지는 HTML과 동일하므로 페이드 생략
    goTo(0, { skipFade: true });
})(jQuery);
