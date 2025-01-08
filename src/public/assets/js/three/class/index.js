// 画像をテクスチャにしたplaneを扱うクラス
export class ImagePlane {
  constructor (canvasSize, mesh, img) {
    this.canvasSize = canvasSize
    this.refImage = img
    this.mesh = mesh
  }

  setParams () {
    // 参照するimg要素から大きさ、位置を取得してセット
    const rect = this.refImage.getBoundingClientRect()

    this.mesh.scale.x = rect.width
    this.mesh.scale.y = rect.height

    const x = rect.left - this.canvasSize.w / 2 + rect.width / 2
    const y = -rect.top + this.canvasSize.h / 2 - rect.height / 2
    this.mesh.position.set(x, y, this.mesh.position.z)
  }

  update (offset) {
    this.setParams()

    this.mesh.material.uniforms.uTime.value = offset
  }

  resize (canvasMapEl) {
    this.mesh.material.uniforms.uPlaneAspect.value = canvasMapEl.clientWidth / canvasMapEl.clientHeight
  }
}
