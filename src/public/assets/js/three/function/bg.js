// Planeメッシュを作る関数
import * as THREE from 'three'
import { VertexShader } from '../shader/bg/vertex'
import { FragmentShader } from '../shader/bg/fragment'
export const createMesh = (img) => {
  const loader = new THREE.TextureLoader()
  const texture = loader.load(img.src)

  const uniforms = {
    uTexture: { value: texture },
    uImageAspect: { value: img.naturalWidth / img.naturalHeight },
    uPlaneAspect: { value: img.clientWidth / img.clientHeight },
    uTime: { value: 0 }
  }
  const geo = new THREE.PlaneBufferGeometry(1, 1, 10, 1) // 後から画像のサイズにscaleするので1にしておく
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VertexShader,
    fragmentShader: FragmentShader
  })

  const mesh = new THREE.Mesh(geo, mat)

  return mesh
}
