/* ---------------------------------------------------------------
* コンテンツサイズでレスポンシブデザイン

  options
  point : 連想配列 例) {sp:620,tablet:968,pc:1024}
--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.respContSize = function (options) {
    const elements = $(this)
    const opts = $.extend({}, $.fn.respContSize.defaults, options)

    elements.each(function () {
      Main(this, opts)
    })

    return this
  }

  $.fn.respContSize.defaults = {
    point: { sp: 620, tablet: 968, pc: 1024 }
  }

  // initial method
  function Main (element, options) {
    const $element = $(element)
    const points = []

    $.each(options.point, function (key, value) {
      points[points.length] = value
    })

    const resizeCheck = function () {
      return {
        check: function () {
          let resized = false
          let point = points.length + 1
          const w = $element.outerWidth()
          let counter = -1
          for (let i = 0; i < points.length; i++) {
            if (w <= points[i] && w) {
              point = i + 1
              counter = i
              break
            }
          }
          if (point !== this.currentPoint) resized = true
          this.currentPoint = point

          const sizeKey = Object.keys(options.point).filter((k, i) => {
            return options.point[k] === points[counter]
          })[0]

          return [sizeKey, resized]
        }
      }
    }

    const resizeCheckObj = resizeCheck()

    let timer = false
    $(window).on('resize', function () {
      if (timer !== false) {
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        const checkResult = resizeCheckObj.check()
        const resizePoint = checkResult[0]
        const resizeFlag = checkResult[1]

        if (resizeFlag) {
          $element.removeClass(function (index, className) {
            return (className.match(/\bresp_bp_\S+/g) || []).join(' ')
          })
          if (resizePoint) { $element.addClass('resp_bp_' + resizePoint) }
        }
      }, 200)
    }).trigger('resize')
  }
})(jQuery)
