export const FragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uTime;

  void main(){
    // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
    );

    // 計算結果を用いて補正後のuv値を生成
    vec2 fixedUv = vec2(
      (vUv.x - 0.9) * ratio.x + 0.9,
      (vUv.y - 0.9) * ratio.y + 0.9
    );

    vec2 offset = vec2(0.0, uTime * 0.0003);
    float r = texture2D(uTexture, fixedUv + offset).r;
    float g = texture2D(uTexture, fixedUv + offset * 0.5).g;
    float b = texture2D(uTexture, fixedUv).b;
    vec3 texture = vec3(r, g, b);

    gl_FragColor = vec4(texture, 1.0);
  }
`;
