export default (function () {
  const imageCollector = function (expectedCount, completeFn) {
    let receivedCount = 0
    return function () {
      receivedCount++
      if (receivedCount === expectedCount) {
        completeFn()
      }
    }
  }

  const imagesLoadListener = function (element, callback) {
    const images = element.querySelectorAll('img')
    if (images === null) {
      callback()
      return
    }

    // 画像の数だけloadListenerが呼ばれたらcallbackが呼ばれる
    const loadListener = imageCollector(images.length, callback)
    Array.prototype.forEach.call(images, function (img) {
      if (img.complete) {
        loadListener()
      } else {
        img.onload = loadListener
      }
    })
  }

  return imagesLoadListener
})()
