import { TextScramble } from './libs/textScramble'

export const inviewBehavior = (selector) => {
  const sections = document.querySelectorAll(selector)
  const nodeSections = Array.prototype.slice.call(sections, 0) // IE対応
  const options = {
    root: null, // viewport
    rootMargin: '0px 0px', // viewportの中心が基準
    threshold: 0 // 閾値
  }
  /**
   * 交差したときに呼び出す関数
   * @param entries
   */
  const doWhenIntersect = (entries) => {
    const nodeEntries = Array.prototype.slice.call(entries, 0) // IE対応
    nodeEntries.forEach((entry) => {
      // 交差検知したDOM
      if (entry.isIntersecting) {
        const target = entry?.target
        const text = target?.textContent
        if (text) {
          target.style.height = target.clientHeight + 'px'
          target.fx.setText(entry.target.fxText).then(() => {
            target.style.height = ''
          })
        }
      } else {
        const target = entry?.target
        target.fx.stopText()
      }
    })
  }
  const observer = new IntersectionObserver(doWhenIntersect, options)
  nodeSections.forEach((ns) => {
    ns.fx = new TextScramble(ns)
    ns.fxText = ns.textContent
    observer.observe(ns)
  })
}
