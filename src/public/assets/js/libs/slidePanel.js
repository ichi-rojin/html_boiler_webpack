/* ---------------------------------------------------------------
* スライドパネル
--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.slidePanel = function (options) {
    const opts = $.extend({}, $.fn.slidePanel.defaults, options)

    Main(this, opts)

    return this
  }

  $.fn.slidePanel.defaults = {
    target: 'index',
    kee: 'active',
    panel: '.panel',
    ww: window.innerWidth
  }

  // initial method
  function Main (element, options) {
    const target = options.target
    const $target = $('#' + target)
    const kee = options.kee
    const panel = options.panel
    const winWidth = options.ww

    // Ajaxによるhtml生成に対応するため、liveイベントで

    $(element)
      .bind({
        click: function () {
          clickHandler($(this))
        }
      })
      .live({
        click: function () {
          clickHandler($(this))
        }
      })

    function clickHandler (e) {
      $(panel).css('position', 'absolute')

      if (e.attr('href') === '#' + target) {
        goIndex()
      } else {
        $target.animate({
          left: (winWidth * -1) + 'px'
        }, 500, function () {
          $(this).removeClass(kee)
        })

        $(e.attr('href')).css('left', winWidth).addClass(kee).animate({
          left: 0
        }, 500)
        return false
      }
      /**
      * 戻る
      */
      function goIndex () {
        if ($('div.' + kee).attr('id') === target) return false

        $('div.' + kee).animate({
          left: winWidth + 'px'
        }, 500, function () {
          $(panel).css('position', '')
          $(this).removeClass(kee)
        })
        $target.css('left', (winWidth * -1) + 'px').addClass(kee).animate({
          left: 0
        }, 500)
      };
    }
  }
})(jQuery)
