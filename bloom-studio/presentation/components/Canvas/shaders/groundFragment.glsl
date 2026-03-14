uniform float uTime;
uniform vec3 uSkyColor;
uniform vec3 uSunDir;

varying vec2 vUv;
varying float vElevation;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float n2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm4(vec2 p) {
  float v = 0.0;
  v += n2(p)        * 0.500;
  v += n2(p * 2.1 + vec2(1.7, 9.2)) * 0.250;
  v += n2(p * 4.4 + vec2(8.3, 2.8)) * 0.125;
  v += n2(p * 8.9 + vec2(3.1, 7.4)) * 0.063;
  return v;
}

float fbm3(vec2 p) {
  float v = 0.0;
  v += n2(p)        * 0.500;
  v += n2(p * 2.1 + vec2(1.7, 9.2)) * 0.250;
  v += n2(p * 4.4 + vec2(8.3, 2.8)) * 0.125;
  return v;
}

void main() {
  vec2 xz = vWorldPos.xz;

  vec3 grassDark  = vec3(0.12, 0.32, 0.09);
  vec3 grassMid   = vec3(0.22, 0.50, 0.15);
  vec3 grassLight = vec3(0.35, 0.65, 0.20);
  vec3 yellowDry  = vec3(0.52, 0.60, 0.18);
  vec3 dirtDark   = vec3(0.35, 0.24, 0.12);
  vec3 dirtLight  = vec3(0.50, 0.37, 0.20);
  vec3 mossCol    = vec3(0.16, 0.40, 0.12);
  vec3 cloverCol  = vec3(0.28, 0.58, 0.18);

  float n_large  = fbm4(xz * 0.04);
  float n_medium = fbm4(xz * 0.15 + vec2(5.3, 2.1));
  float n_fine   = fbm3(xz * 0.50 + vec2(1.1, 7.7));
  float n_micro  = n2(xz * 3.2);
  float n_clover = fbm4(xz * 0.22 + vec2(3.0, 5.0));
  float n_dirt   = fbm3(xz * 0.28 + vec2(1.7, 4.2));

  vec3 col = mix(grassDark, grassMid, n_large);
  col = mix(col, grassLight, n_medium * 0.55);

  float highness = smoothstep(0.10, 0.40, vElevation);
  col = mix(col, yellowDry, highness * n_fine * 0.55);

  float clover = smoothstep(0.58, 0.80, n_clover);
  col = mix(col, cloverCol, clover * 0.30);

  float hollow = smoothstep(0.0, -0.20, vElevation);
  vec3 dirtCol = mix(dirtDark, dirtLight, n_dirt);
  col = mix(col, dirtCol, hollow * n_dirt * 0.55);

  float upness   = clamp(dot(vWorldNormal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
  float slopiness = 1.0 - upness;
  col = mix(col, mossCol, slopiness * slopiness * 0.65);

  col += (n_micro - 0.5) * 0.035;

  vec3 sunDir = normalize(vec3(0.6, 1.2, 0.5));
  float diff = clamp(dot(vWorldNormal, sunDir), 0.0, 1.0);
  float ao   = 0.5 + 0.5 * clamp(vElevation * 2.5 + 0.5, 0.0, 1.0);
  float light = 0.30 + 0.70 * diff * ao;
  col *= light;

  float sss = pow(clamp(dot(vWorldNormal, sunDir) * 0.5 + 0.5, 0.0, 1.0), 4.0) * 0.10;
  col += vec3(0.35, 0.65, 0.15) * sss;

  float dist = length(xz);
  float fog  = smoothstep(20.0, 40.0, dist);
  col = mix(col, uSkyColor * 0.50 + vec3(0.04, 0.09, 0.03), fog * 0.45);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
