/* ---------------------------------------------------------------
* スムーススクロール

options
handler : 例)ページ内リンク全てを指定 "a[href*=#]"
duration : アニメーションスピード、ミリ秒で指定
offset : 余白値

--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.smoothScroll = function (options) {
    const elements = $(this)
    const opts = $.extend({}, $.fn.smoothScroll.defaults, options)

    elements.each(function () {
      Main(this, opts)
    })

    return this
  }

  $.fn.smoothScroll.defaults = {
    handler: 'a[href*=#]',
    duration: 400,
    offset: 40
  }

  // initial method
  function Main (element, options) {
    $(element).click(function () {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
        location.hostname === this.hostname) {
        const _target = $(this.hash)
        const $target = _target.length ? _target : $('[name=' + this.hash.slice(1) + ']')
        if ($target.length) {
          const targetOffset = $target.offset().top - options.offset
          $('html,body')
            .animate({ scrollTop: targetOffset }, options.duration)
          return false
        }
      }
    })
  }
})(jQuery)
