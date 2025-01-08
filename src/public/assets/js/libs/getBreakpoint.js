/* ---------------------------------------------------------------
* ブレークポイントチェック
  var $wSize = $.fn.getBreakpoint();
  $wSize.on("onPointChanged onPointInit", function(event, point){
    console.log(point);
  });

  options
  point : 連想配列 例) {sp:620,tablet:968,pc:1024}
--------------------------------------------------------------- */
import { ANS } from './common'
const jQuery = window.jQuery

export default (function ($) {
  $.fn.getBreakpoint = function (options) {
    const opts = $.extend({}, $.fn.getBreakpoint.defaults, options)

    return Main(this, opts)
  }

  $.fn.getBreakpoint.defaults = {
    point: ANS.common.breakpoints
  }

  // initial method
  function Main (element, options) {
    const $obj = $('<div></div>')
    const points = []

    $.each(options.point, function (key, value) {
      points[points.length] = value
    })

    const resizeCheck = function () {
      return {
        check: function () {
          let resized = false
          let point = points.length + 1
          const w = window.innerWidth || $(window).width() + 16
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

          const sizeKey = Object.keys(options.point).filter((k) => {
            return options.point[k] === points[counter]
          })[0]

          return [sizeKey, resized]
        }
      }
    }

    const resizeCheckObj = resizeCheck()

    $(window).on('resize', function () {
      const checkResult = resizeCheckObj.check()
      const resizePoint = checkResult[0]
      const resizeFlag = checkResult[1]

      if (resizeFlag) {
        $obj.trigger('onPointChanged', resizePoint)
      }
    })

    setTimeout(function () {
      $obj.trigger('onPointInit', resizeCheckObj.check()[0])
    }, 0)

    return $obj
  }
})(jQuery)
