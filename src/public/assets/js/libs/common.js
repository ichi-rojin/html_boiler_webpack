// グローバル名前空間定義
export let ANS
if (!ANS) ANS = {}
if (!ANS.common) ANS.common = {}

// このファイルの絶対パスを取得
// ex.)
// var current_path = $('<a>', { href:ANS.common.path } )[0].pathname;
// var parse_dir = current_path.split("/");
// parse_dir = parse_dir.filter(function(e){return e !=== "";});
//
ANS.common.path = (function () {
  if (document.currentScript) {
    return document.currentScript.src
  } else {
    const scripts = document.getElementsByTagName('script')
    const script = scripts[scripts.length - 1]
    if (script.src) {
      return script.src
    }
  }
})()

ANS.common.ua = (function (u) {
  return {
    Tablet: (u.indexOf('windows') !== -1 && u.indexOf('touch') !== -1) ||
    u.indexOf('ipad') !== -1 ||
    (u.indexOf('android') !== -1 && u.indexOf('mobile') === -1) ||
    (u.indexOf('firefox') !== -1 && u.indexOf('tablet') !== -1) ||
    u.indexOf('kindle') !== -1 ||
    u.indexOf('silk') !== -1 ||
    u.indexOf('playbook') !== -1,
    Mobile: (u.indexOf('windows') !== -1 && u.indexOf('phone') !== -1) ||
    u.indexOf('iphone') !== -1 ||
    u.indexOf('ipod') !== -1 ||
    (u.indexOf('android') !== -1 && u.indexOf('mobile') !== -1) ||
    (u.indexOf('firefox') !== -1 && u.indexOf('mobile') !== -1) ||
    u.indexOf('blackberry') !== -1
  }
})(window.navigator.userAgent.toLowerCase())

// モバイルデバイス検出
if (ANS.common.ua.Mobile) {
  document.documentElement.classList.add('device--sp')
}

/* -----------------------------------------------------
レスポンシブ処理
----------------------------------------------------- */
ANS.common.breakpoints = {
  sp: 600,
  tablet: 960,
  mobile: 1280
}
ANS.common.responsiveFunc = function () {
  const W = window.screen.width

  if (W > ANS.common.breakpoints.sp) { return }

  const viewport = document.getElementsByName('viewport')
  if (viewport.length > 0) {
    for (let i = 0; i <= viewport.length; i++) {
      viewport[i].parentNode.removeChild(viewport[i])
    }
  }

  // viewportセット
  const viewportDom = document.createElement('meta')
  viewportDom.setAttribute('name', 'viewport')
  viewportDom.setAttribute('content', 'width=device-width,initial-scale=1')

  document.getElementsByTagName('head')[0].appendChild(viewportDom)
}
ANS.common.responsiveFunc()

// 一度だけ実行
// const promise = ANS.common.PromiseOnce(function(){
//   callback...
// });
// window.addEventListener('resize', promise);
ANS.common.PromiseOnce = function (callback, delay) {
  const _delay = delay || 200
  let timer = 0
  return function () {
    if (timer > 0) {
      clearTimeout(timer)
    }
    timer = setTimeout(callback, _delay)
  }
}

// カスタムプロパティ
const promise = ANS.common.PromiseOnce(function () {
  ANS.common.ww = document.body.clientWidth
  ANS.common.wh = window.innerHeight
  ANS.common.sh = ANS.common.wh / document.body.clientHeight * 100

  // set css custom property
  document.documentElement.style.setProperty('--vw', ANS.common.ww + 'px')
  document.documentElement.style.setProperty('--vh', ANS.common.wh + 'px')
  document.documentElement.style.setProperty('--sh', ANS.common.sh + '%')
})
document.addEventListener('DOMContentLoaded', promise)
window.addEventListener('resize', promise)
