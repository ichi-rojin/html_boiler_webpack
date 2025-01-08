/* ---------------------------------------------------------------
* URLパラメーターセット

  $.fn.setParams(base_url,{key:"value",key:"value"})

--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.setParams = function (url, params) {
    url += '?'
    let key
    if (params instanceof Array) {
      url += params.join('&')
    } else {
      const b = []
      for (key in params) {
        b.push(key + '=' + params[key])
        url += b.join('&')
      }
      return url
    }
  }
})(jQuery)
