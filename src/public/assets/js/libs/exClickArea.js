/* ---------------------------------------------------------------
* クリックエリア拡張
--------------------------------------------------------------- */
const jQuery = window.jQuery;

(function ($) {
  $.fn.exClickArea = function (options) {
    const elements = $(this)
    const opts = $.extend({}, $.fn.exClickArea.defaults, options)

    elements.each(function () {
      Main(this, opts)
    })

    return this
  }

  $.fn.exClickArea.defaults = {
  }

  // initial method
  function Main (element, options) {
    const $anchor = $(element).find('a')
    const _href = $anchor.attr('href')
    const _target = $anchor.attr('target')

    $anchor.filter('[target=_blank]').addClass('blank')

    $(element)
      .css({
        cursor: 'pointer'
      })
      .bind({
        click: function () {
          if (_href) {
            if (_target) {
              window.open(_href, _target)
            } else {
              window.location = _href
            }
            return false
          }
        },
        mouseover: function () {
          $(this).css({ opacity: 0.7 })
        },
        mouseout: function () {
          $(this).css({ opacity: 1 })
        }
      })
  }
})(jQuery)
