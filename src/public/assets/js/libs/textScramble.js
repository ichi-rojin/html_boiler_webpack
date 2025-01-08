export class TextScramble {
  constructor (el) {
    this.el = el
    this.chars = ' _akstnhmyrwiueo'
    this.update = this.update.bind(this)
  }

  setText (nt) {
    const newText = nt.trim()
    const oldText = this.el.innerText.trim()
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => { return (this.resolve = resolve) })
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 10)
      const end = start + 10
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  stopText () {
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
  }

  async update () {
    let output = ''
    let complete = 0
    const startTime = performance.now()
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random()) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += char
      } else {
        output += from
      }
    }
    const endTime = performance.now()
    const diffTime = endTime - startTime
    const threshold = 20 / 1000
    const waitTime =
                    threshold < diffTime
                      ? diffTime
                      : threshold - diffTime

    await this.sleep(waitTime + 20 - threshold)

    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  randomChar () {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }

  async sleep (msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}
