import * as THREE from 'three'
import { createMesh } from './function/bg'
import { ImagePlane } from './class'

// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('bgCanvas')
  const canvasMapEl = document.getElementById('bgCanvasMap')
  const canvasSize = {
    w: window.innerWidth,
    h: window.innerHeight
  }

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(canvasSize.w, canvasSize.h)

  // ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
  const fov = 60 // 視野角
  const fovRad = (fov / 2) * (Math.PI / 180)
  const dist = canvasSize.h / 2 / Math.tan(fovRad)
  const camera = new THREE.PerspectiveCamera(
    fov,
    canvasSize.w / canvasSize.h,
    0.1,
    1000
  )
  camera.position.z = dist <= 1000 ? dist : 1000

  const scene = new THREE.Scene()

  // スクロール追従
  let targetScrollY = 0 // スクロール位置
  let currentScrollY = 0 // 線形補間を適用した現在のスクロール位置
  let scrollOffset = 0 // 上記2つの差分

  // 開始と終了をなめらかに補間する関数
  const lerp = (start, end, multiplier) => {
    return (1 - multiplier) * start + multiplier * end
  }

  const updateScroll = () => {
    // スクロール位置を取得
    targetScrollY = document.documentElement.scrollTop
    // リープ関数でスクロール位置をなめらかに追従
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.1)

    scrollOffset = targetScrollY - currentScrollY
  }

  const imagePlaneArray = []

  // 毎フレーム呼び出す
  const loop = () => {
    updateScroll()
    for (const plane of imagePlaneArray) {
      plane.update(scrollOffset)
    }
    renderer.render(scene, camera)

    requestAnimationFrame(loop)
  }

  // リサイズ処理
  let timeoutId = 0
  const resize = () => {
    // three.jsのリサイズ
    const width = window.innerWidth
    const height = window.innerHeight

    canvasSize.w = width
    canvasSize.h = height

    for (const plane of imagePlaneArray) {
      plane.resize(canvasMapEl)
    }
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // カメラの距離を計算し直す
    const fov = 60
    const fovRad = (fov / 2) * (Math.PI / 180)
    const dist = canvasSize.h / 2 / Math.tan(fovRad)
    camera.position.z = dist <= 1000 ? dist : 1000
  }

  const main = () => {
    window.addEventListener('load', () => {
      const imageArray = [...document.querySelectorAll('.bgCanvasMap img')]
      for (const img of imageArray) {
        const mesh = createMesh(img)
        scene.add(mesh)

        const imagePlane = new ImagePlane(canvasSize, mesh, img)
        imagePlane.setParams()

        imagePlaneArray.push(imagePlane)
      }
      loop()
    })

    // リサイズ（負荷軽減のためリサイズが完了してから発火する）
    window.addEventListener('resize', () => {
      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = setTimeout(resize, 200)
    })
  }

  main()
})
