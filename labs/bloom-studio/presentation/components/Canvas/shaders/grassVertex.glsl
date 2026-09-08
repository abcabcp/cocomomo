uniform float uTime;
uniform float uWindStrength;

attribute vec3 instanceOffset;
attribute float instanceRotY;
attribute float instanceScale;

varying float vHeight;
varying vec2 vUv;

void main() {
  vUv = uv;
  vHeight = position.y;

  float sway = sin(uTime * 2.0 + instanceOffset.x * 0.7 + instanceOffset.z * 0.5) * uWindStrength * vHeight * vHeight;
  float swayZ = cos(uTime * 1.7 + instanceOffset.x * 0.5 + instanceOffset.z * 0.8) * uWindStrength * 0.4 * vHeight * vHeight;

  vec3 pos = position;
  pos.x += sway;
  pos.z += swayZ;

  pos *= instanceScale;

  float c = cos(instanceRotY);
  float s = sin(instanceRotY);
  pos = vec3(c * pos.x - s * pos.z, pos.y, s * pos.x + c * pos.z);

  pos += instanceOffset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
