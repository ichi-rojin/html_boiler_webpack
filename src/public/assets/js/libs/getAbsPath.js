/* ---------------------------------------------------------------
* 絶対パス取得
--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.getAbsPath = function (path) {
    const e = document.createElement('span')
    e.innerHTML = '<a href="' + path + '" />'
    return e.firstChild.href
  }
})(jQuery)
