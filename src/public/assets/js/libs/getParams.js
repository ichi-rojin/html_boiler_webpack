/* ---------------------------------------------------------------
* URLパラメーター取得

  取得後は連想配列でアクセス 例) var["key"] var.key

--------------------------------------------------------------- */
const jQuery = window.jQuery

export default (function ($) {
  $.fn.getParams = function () {
    const hashmap = []
    let query = window.location.search.substring(1)
    if (!query) return ''
    query = decodeURI(query)
    const params = query.split('&')

    for (let i = 0; i < params.length; i++) {
      const pos = params[i].indexOf('=')
      if (pos > 0) {
        const key = params[i].substring(0, pos)
        const val = params[i].substring(pos + 1)
        hashmap[key] = val
      }
    }
    return hashmap
  }
})(jQuery)
