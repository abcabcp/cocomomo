#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    #define DEVICE_TYPE 1
  #else
    #define DEVICE_TYPE 2
  #endif
#else
  #define DEVICE_TYPE 0
#endif

#if DEVICE_TYPE == 1
  #define MOBILE_ADJUST 0.8
#elif DEVICE_TYPE == 2
  #define MOBILE_ADJUST 0.5
#else
  #define MOBILE_ADJUST 1.0
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform vec3 uSkyColor;
uniform vec3 uSkyTopColor;
uniform vec3 uSeaBaseColor;
uniform vec3 uSeaWaterColor;
uniform vec3 uSunPosition;
uniform vec3 uMoonPosition;
uniform float uMoonBrightness;
uniform float uStarBrightness;
uniform float uWaveSpeed;
uniform float uWaveHeight;
uniform float uWaveChoppy;

const int NUM_STEPS = 8;
const float PI = 3.141592653589793;
const float EPSILON = 1e-3;
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_FREQ = 0.16;

float SEA_HEIGHT;
float SEA_CHOPPY;
float SEA_TIME;
float EPSILON_NRM;
vec3 SEA_BASE;
vec3 SEA_WATER_COLOR;

mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float sea_octave(vec2 uv, float choppy) {
  uv += noise(uv) * 0.5;
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}


float diffuse(vec3 n, vec3 l, float p) {
  return pow(dot(n, l) * 0.4 + 0.6, p);
}

float specular(vec3 n, vec3 l, vec3 e, float s) {
  float norm = (s + 8.0) / (3.1415 * 8.0);
  return pow(max(dot(reflect(e, n), l), 0.0), s) * norm;
}

vec3 getSkyColor(vec3 dir) {
  dir.y = max(dir.y, 0.0);
  vec3 color = mix(uSkyColor, uSkyTopColor, dir.y);

  float sunFactor = pow(max(0.0, 1.0 - 8.0 * distance(normalize(dir), normalize(uSunPosition))), 8.0);
  color += vec3(1.2, 1.0, 0.7) * sunFactor * 0.2;

  float moonFactor = pow(max(0.0, 1.0 - 8.0 * distance(normalize(dir), normalize(uMoonPosition))), 8.0);
  color += vec3(0.95, 0.95, 1.1) * moonFactor * uMoonBrightness * 0.2;

  if (uStarBrightness > 0.0) {
    vec2 uv = vec2(atan(dir.z, dir.x), asin(dir.y));
    vec2 grid = floor(uv * 30.0);
    vec2 pos = fract(uv * 30.0) - 0.5;
    float rnd = hash(grid);
    float dist = length(pos);
    float stars = (1.0 - smoothstep(0.02, 0.04, dist)) * step(0.95, rnd);
    float twinkle = 0.7 + 0.3 * sin(iGlobalTime * (1.0 + rnd) + rnd * 10.0);
    stars *= uStarBrightness * max(0.0, dir.y + 0.1) * twinkle;
    color += vec3(0.8, 0.9, 1.0) * stars;
  }
  return color;
}

float map(vec3 p) {
  vec2 uv = p.xz; uv.x *= 0.75;
  float h = 0.0;
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  for (int i = 0; i < ITER_GEOMETRY; i++) {
    h += sea_octave((uv + SEA_TIME) * freq, choppy) * amp;
    h += sea_octave((uv - SEA_TIME) * freq, choppy) * amp;
    uv *= octave_m;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

float map_detailed(vec3 p) {
  vec2 uv = p.xz; uv.x *= 0.75;
  float h = 0.0;
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  for (int i = 0; i < ITER_FRAGMENT; i++) {
    h += sea_octave((uv + SEA_TIME) * freq, choppy) * amp;
    h += sea_octave((uv - SEA_TIME) * freq, choppy) * amp;
    uv *= octave_m;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
  float fresnel = pow(1.0 - max(dot(n, -eye), 0.0), 3.0) * 0.65;
  vec3 reflected = getSkyColor(reflect(eye, n));
  vec3 refracted = SEA_BASE + diffuse(n, l, 80.0) * SEA_WATER_COLOR * 0.12;
  vec3 color = mix(refracted, reflected, fresnel);
  float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
  color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
  color += vec3(specular(n, l, eye, 60.0));
  return color;
}

vec3 getNormal(vec3 p, float eps) {
  float base = map_detailed(p);
  return normalize(vec3(
    map_detailed(p + vec3(eps, 0.0, 0.0)) - base,
    eps,
    map_detailed(p + vec3(0.0, 0.0, eps)) - base
  ));
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
  float tm = 0.0;
  float tx = 1000.0;
  float hx = map(ori + dir * tx);
  if (hx > 0.0) return tx;

  float hm = map(ori + dir * tm);
  float tmid = 0.0;
  for (int i = 0; i < NUM_STEPS; i++) {
    tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;
    float hmid = map(p);
    if (hmid < 0.0) {
      tx = tmid;
      hx = hmid;
    } else {
      tm = tmid;
      hm = hmid;
    }
  }
  return tmid;
}

vec3 renderSunMoon(vec3 rayDir) {
  vec3 sunColor = vec3(1.0, 0.9, 0.7) * 0.02;
  vec3 moonColor = vec3(0.9, 0.9, 1.0) * 0.02;
  float sun = pow(smoothstep(1.0 - 0.0005, 1.0, max(0.0, 1.0 - 3.0 * distance(normalize(rayDir), normalize(uSunPosition)))), 2.0);
  float moon = pow(smoothstep(1.0 - 0.005, 1.0, max(0.0, 1.0 - 2.0 * distance(normalize(rayDir), normalize(uMoonPosition)))), 2.0) * uMoonBrightness;
  return sun * sunColor + moon * moonColor;
}

void main() {
  #ifndef MOBILE_ADJUST
    gl_FragColor = vec4(0.0, 0.5, 0.8, 1.0);
    return;
  #endif

  #if DEVICE_TYPE == 2
    gl_FragColor = vec4(uSeaWaterColor, 1.0);
    return;
  #endif

  SEA_TIME = mod(iGlobalTime * uWaveSpeed * MOBILE_ADJUST, 30.0);
  SEA_HEIGHT = uWaveHeight * mix(0.3, 1.0, MOBILE_ADJUST);
  SEA_CHOPPY = uWaveChoppy * mix(0.3, 1.0, MOBILE_ADJUST);
  SEA_BASE = uSeaBaseColor;
  SEA_WATER_COLOR = uSeaWaterColor;
  EPSILON_NRM = 0.1 / iResolution.x * (1.0 / MOBILE_ADJUST);

  vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec3 dir = normalize(vec3(uv.x, uv.y, -2.0));
  dir.z += length(uv) * 0.15;
  dir = normalize(dir);

  vec3 ori = vec3(0.0, 3.5, mod(iGlobalTime * 0.3 * 5.0, 1000.0));
  vec3 p;
  heightMapTracing(ori, dir, p);
  vec3 dist = p - ori;
  vec3 n = getNormal(p, dot(dist, dist) * EPSILON_NRM);
  vec3 light = normalize(mix(vec3(0.0, 1.0, 0.8), uSunPosition, 0.8));

  vec3 skyColor = getSkyColor(dir);
  vec3 seaColor = getSeaColor(p, n, light, dir, dist);
  vec3 result = mix(skyColor, seaColor, pow(smoothstep(0.0, -0.05, dir.y), 0.3));
  vec3 sunMoon = renderSunMoon(dir);
  result = mix(result, sunMoon, clamp(length(sunMoon), 0.0, 0.95));

  gl_FragColor = vec4(pow(result, vec3(0.65)), 1.0);
}