/* ---------------------------------------------------------------
* アコーディオンメニュー

options
trigger : アコーディオンのタイトル 例) ".title"
target : アコーディオンのボディ 例) ".content"
wrapper : アコーディオンのタイトルとボディ、対になる要素のラッパー
duration : 開くスピード、ミリ秒で指定
exclude : クリックした項目以外を隠す場合のみ true を指定
init : 最初に開く項目のインデックス番号 0～

--------------------------------------------------------------- */
import { ANS } from './common'
const jQuery = window.jQuery

export default (function ($) {
  $.fn.accordionList = function (options) {
    const elements = $(this)
    const opts = $.extend({}, $.fn.accordionList.defaults, options)

    elements.each(function () {
      Main(this, opts)
    })

    return this
  }

  $.fn.accordionList.defaults = {
    sponly: false,
    cssonly: false,
    wrapper: '.wrapper',
    trigger: '.trigger',
    target: '.target',
    duration: 500,
    exclude: false
  }

  // initial method
  function Main (element, options) {
    const $container = $(element)
    const $trigger = $container.find(options.trigger).css('cursor', 'pointer')
    const $targetGroup = $container.find(options.target)
    const selectedClassname = 'status--opened'

    if ($targetGroup.length < 1) { return }

    $targetGroup.closest(options.wrapper).addClass('valid--accordion')

    if (!options.cssonly) {
      if (options.init === undefined) {
        $targetGroup.hide()
      } else {
        $targetGroup.not(':eq(' + options.init + ')').hide()
        const $initWrapper = $targetGroup.filter(':eq(' + options.init + ')').closest(options.wrapper)
        $initWrapper.addClass('opened')
      }
    }

    function _open ($target) {
      if (options.cssonly) { return }
      $target.slideDown(options.duration)
    }
    function _close ($target) {
      if (options.cssonly) { return }
      $target.slideUp(options.duration)
    }

    $trigger.find('a').on('click', function (e) {
      e.stopPropagation()
    })
    $trigger.bind({
      click: function (e) {
        const $currentTrigger = $(this)
        if (
          options.sponly &&
          ANS.common.ww > ANS.common.breakpoints.sp
        ) {
          return
        }
        const $wrapper = $(this).closest(options.wrapper)
        let $target = $wrapper.find(options.target)

        $target = $target.eq(0)

        if ($target.length > 0) {
          e.preventDefault()
        };

        if (!$wrapper.hasClass(selectedClassname)) {
          _open($target)
          $wrapper.addClass(selectedClassname)

          if (options.exclude) {
            const exi = $targetGroup.index($currentTrigger.closest(options.wrapper).find(options.target))

            const $excludes = $targetGroup.not(':eq(' + exi + ')')
            _close($excludes)
            $excludes.each(function () {
              const $excludesWrapper = $(this).closest(options.wrapper)
              $excludesWrapper.removeClass(selectedClassname)
            })

            // ターゲットをviewportに収める
            const headerH = parseInt(document.documentElement.style.getPropertyValue('--headerH')) || $('.fix-header:first').outerHeight()
            const intervalID = setInterval(function () {
              const targetOffset = $currentTrigger.offset().top - headerH - 10
              $('html,body')
                .stop().animate({ scrollTop: targetOffset }, options.duration)
            }, options.duration / 10)
            setTimeout(function () { clearInterval(intervalID) }, options.duration)
          }
        } else {
          _close($target)
          $wrapper.removeClass(selectedClassname)
        }
      }
    })
  }
})(jQuery)
