uniform vec3 uBaseColor;
uniform vec3 uTipColor;

varying float vHeight;
varying vec2 vUv;

void main() {
  float t = clamp(vHeight * 1.2, 0.0, 1.0);
  vec3 color = mix(uBaseColor, uTipColor, t);

  float alpha = 1.0 - smoothstep(0.7, 1.0, vUv.y) * 0.3;

  gl_FragColor = vec4(color, alpha);
}
