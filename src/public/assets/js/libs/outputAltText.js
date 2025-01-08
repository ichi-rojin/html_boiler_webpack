/* ---------------------------------------------------------------
* 画像⇔テキスト切り替え
--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.outputAltText = function (options) {
    const elements = $(this)
    const opts = $.extend({}, $.fn.outputAltText.defaults, options)

    elements.each(function () {
      Main(this, opts)
    })

    return this
  }

  $.fn.outputAltText.defaults = {
    breakpint: 480
  }

  // initial method
  function Main (element, options) {
    const $wrapper = $(element)
    const $img = $wrapper.find('img').clone()
    const $copy = $img.attr('alt')

    $(window).bind('resize', function () {
      resizeArg()
    })
    resizeArg()
    function resizeArg () {
      if ($(this).width() < options.breakpint) {
        $img.remove()
        $wrapper.addClass('text_output').text($copy)
      } else {
        $wrapper.text('')
        $wrapper.removeClass('text_output').append($img)
      }
    }
  }
})(jQuery)
