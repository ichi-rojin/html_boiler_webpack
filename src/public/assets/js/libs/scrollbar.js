import { ANS } from './common'

class ScrollBar {
  constructor (el) {
    // wheel event
    this.wheelEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll'
    this.customScrollBar = document.createElement('div')
    this.customScrollBar.classList = 'customScrollBar'
    this.customScrollBar.style.cursor = 'pointer'
    document.body.appendChild(this.customScrollBar)

    this.customScrollBarBase = document.createElement('div')
    this.customScrollBarBase.classList = 'customScrollBarBase'
    this.customScrollBarBase.style.display = 'none'
    document.body.appendChild(this.customScrollBarBase)
  }

  enableScroll () {
    const className = document.body.className
    if (className.indexOf('drawer--isOpen') >= 0) return false
    return true
  }

  wheel () {
    window.addEventListener(this.wheelEvent, (e, i) => {
      if (!this.enableScroll()) return false
      document.documentElement.scrollTop -= e.wheelDelta * 1.25
    })
  }

  position () {
    const scrollHandler = ANS.common.PromiseOnce(() => {
      const st = document.documentElement.scrollTop
      const sq = st / document.body.clientHeight * 100

      // set css custom property
      this.customScrollBar.style.top = Math.floor(sq) + '%'
    }, 10)
    window.addEventListener('scroll', scrollHandler)
  }

  drag () {
    let isDrag = false

    this.customScrollBar.addEventListener('mousedown', () => {
      this.customScrollBarBase.style.display = 'block'
      isDrag = true
    })

    this.customScrollBar.addEventListener('mouseup', () => {
      this.customScrollBarBase.style.display = 'none'
      isDrag = false
    })

    this.customScrollBarBase.addEventListener('mouseup', () => {
      this.customScrollBarBase.style.display = 'none'
      isDrag = false
    })

    window.addEventListener('mouseup', () => {
      this.customScrollBarBase.style.display = 'none'
      isDrag = false
    })

    window.addEventListener('mousedown', async (e) => {
      if (!this.enableScroll()) return false
      // ホイールクリック
      if (e.button === 1) {
        e.preventDefault()
        isDrag = true
        document.body.style.cursor = 'grab'
        await this.sleep(100)
        document.body.style.cursor = 'grabbing'
      }
    })

    window.addEventListener('mouseup', (e) => {
      // ホイールクリック
      if (e.button === 1) {
        isDrag = false
        document.body.style.cursor = ''
      }
    })

    const dragMove = (e) => {
      if (!isDrag) return

      const wH = window.innerHeight
      const per = e.clientY / wH
      const total = document.body.clientHeight
      const move = per * total
      const cursorH = this.customScrollBar.offsetHeight
      const scrollQty = move - Math.floor((cursorH / 2) / wH * total)
      document.documentElement.scrollTop = scrollQty
    }

    window.addEventListener('mousemove', dragMove)

    this.customScrollBar.addEventListener('mousemove', dragMove)
  }

  async sleep (msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}

const isTouchDevice = (function () {
  var div = document.createElement('div')
  div.setAttribute('ontouchstart', 'return')
  return (typeof div.ontouchstart === 'function')
})()

if (isTouchDevice) {
  document.documentElement.classList.add('isTouchDevice')
} else {
  const scrollbar = new ScrollBar()
  scrollbar.wheel()
  scrollbar.position()
  scrollbar.drag()
}
