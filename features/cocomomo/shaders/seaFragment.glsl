uniform float iGlobalTime;
uniform vec2 iResolution;
uniform float uAspectRatio;

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

uniform float uQualityLevel; 

const int NUM_STEPS = 6; 
const float PI = 3.1415;
const float EPSILON = 1e-3;
float EPSILON_NRM;

int ITER_GEOMETRY; 
int ITER_FRAGMENT; 
float SEA_HEIGHT;      
float SEA_CHOPPY;      
const float SEA_SPEED = 1.0;
const float SEA_FREQ = 0.16;
vec3 SEA_BASE;         
vec3 SEA_WATER_COLOR;  
float SEA_TIME;
mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

mat3 fromEuler(vec3 ang) {
  vec2 a1 = vec2(sin(ang.x),cos(ang.x));
  vec2 a2 = vec2(sin(ang.y),cos(ang.y));
  vec2 a3 = vec2(sin(ang.z),cos(ang.z));
  mat3 m;
  m[0] = vec3(
  	a1.y*a3.y+a1.x*a2.x*a3.x,
  	a1.y*a2.x*a3.x+a3.y*a1.x,
  	-a2.y*a3.x
  );
  m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
  m[2] = vec3(
  	a3.y*a1.x*a2.x+a1.y*a3.x,
    a1.x*a3.x-a1.y*a3.y*a2.x,
    a2.y*a3.y
  );
  return m;
}

float hash( vec2 p ) {
  float h = dot(p,vec2(127.1,311.7));	
  return fract(sin(h)*43758.5453123);
}

float noise( in vec2 p ) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  vec2 u = f * f; 
  
  return -1.0 + 2.0 * mix(
    mix(hash(i + vec2(0.0,0.0)), 
        hash(i + vec2(1.0,0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), 
        hash(i + vec2(1.0,1.0)), u.x), 
    u.y
  );
}

float diffuse(vec3 n,vec3 l,float p) {
  return pow(dot(n,l) * 0.4 + 0.6,p);
}

float specular(vec3 n,vec3 l,vec3 e,float s) {    
  float nrm = (s + 8.0) / (3.1415 * 8.0);
  return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

vec3 getSkyColor(vec3 e) {
  e.y = max(e.y, 0.0);
  
  vec3 ret = mix(uSkyColor, uSkyTopColor, e.y);
  
  float sunIntensity = max(0.0, 1.0 - 8.0 * distance(normalize(e), normalize(uSunPosition)));
  sunIntensity = pow(sunIntensity, 6.0); 
  ret += vec3(1.2, 1.0, 0.7) * sunIntensity * 0.2; 
  
  float moonIntensity = max(0.0, 1.0 - 8.0 * distance(normalize(e), normalize(uMoonPosition)));
  moonIntensity = pow(moonIntensity, 6.0); 
  ret += vec3(0.95, 0.95, 1.1) * moonIntensity * uMoonBrightness * 0.2; 
  
  if (uStarBrightness > 0.0 && uQualityLevel > 0.5) {
    vec2 uv = vec2(atan(e.z, e.x), asin(e.y));
    
    vec2 grid = floor(uv * 20.0); 
    vec2 pos = fract(uv * 20.0) - 0.5;
    
    float rnd = hash(grid);
    float dist = length(pos);
    
    float stars = (1.0 - step(0.04, dist)) * step(0.97, rnd);
    
    float twinkle = 0.8 + 0.2 * sin(iGlobalTime * rnd);
    
    stars *= uStarBrightness * max(0.0, e.y + 0.1) * twinkle;
    ret += vec3(0.8, 0.9, 1.0) * stars;
  }
  
  return ret;
}

float sea_octave(vec2 uv, float choppy) {
  uv += noise(uv);         
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));    
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

float map(vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz; 
  uv.x *= 0.75;

  float d, h = 0.0;    
  for(int i = 0; i < ITER_GEOMETRY; i++) {
    float adjustedTime = SEA_TIME * uWaveSpeed;
    d = sea_octave((uv + adjustedTime) * freq, choppy);
    d += sea_octave((uv - adjustedTime) * freq, choppy);
    h += d * amp;        
    uv *= octave_m;
    freq *= 1.9; 
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
    
    if(uQualityLevel < 0.5 && i >= 1) break;
  }
  return p.y - h;
}

float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz;
    uv.x *= 0.75;

    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {
      float adjustedTime = SEA_TIME * uWaveSpeed;
      d = sea_octave((uv+adjustedTime) * freq, choppy);
      d += sea_octave((uv-adjustedTime) * freq, choppy);
      h += d * amp;        
      uv *= octave_m;
      freq *= 1.9; 
      amp *= 0.22;
      choppy = mix(choppy,1.0,0.2);
      
      if(uQualityLevel < 0.5 && i >= 2) break;
    }
    return p.y - h;
}

vec3 getSeaColor(
	vec3 p,
  vec3 n, 
  vec3 l, 
  vec3 eye, 
  vec3 dist
) {  
  float fresnel = 1.0 - max(dot(n,-eye),0.0);
  fresnel = pow(fresnel,3.0) * 0.65;

  vec3 reflected = getSkyColor(reflect(eye,n));    
  vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 

  vec3 color = mix(refracted,reflected,fresnel);

  float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
  color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;

  color += vec3(specular(n,l,eye,60.0));

  return color;
}

vec3 getNormal(vec3 p, float eps) {
  vec3 n;
  n.y = map_detailed(p);    
  
  if(uQualityLevel < 0.5) {
    eps *= 2.0;
  }
  
  n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
  n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
  n.y = eps;
  return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
  float tm = 0.0;
  float tx = 1000.0;    
  float hx = map(ori + dir * tx);

  if(hx > 0.0) {
    return tx;   
  }

  float hm = map(ori + dir * tm);    
  float tmid = 0.0;
  
  int steps = NUM_STEPS;
  if(uQualityLevel < 0.5) {
    steps = 5; 
  }
  
  for(int i = 0; i < NUM_STEPS; i++) {
    if(i >= steps) break; 
    
    tmid = mix(tm,tx, hm/(hm-hx));                   
    p = ori + dir * tmid;                   
    float hmid = map(p);
    if(hmid < 0.0) {
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
  
  float sunSize = 0.0005; 
  float sunDot = max(0.0, 1.0 - 3.0 * distance(normalize(rayDir), normalize(uSunPosition)));
  float sun = pow(smoothstep(1.0 - sunSize, 1.0, sunDot), 2.0); 
  
  float moonSize = 0.005; 
  float moonDot = max(0.0, 1.0 - 2.0 * distance(normalize(rayDir), normalize(uMoonPosition)));
  float moon = pow(smoothstep(1.0 - moonSize, 1.0, moonDot), 2.0) * uMoonBrightness; 
  
  vec3 result = vec3(0.0);
  result += sun * sunColor;
  result += moon * moonColor;
  
  return result;
}

void main() {
  EPSILON_NRM = 0.1 / iResolution.x;
  
  ITER_GEOMETRY = uQualityLevel > 0.5 ? 3 : 2;
  ITER_FRAGMENT = uQualityLevel > 0.5 ? 5 : 3;
  
  SEA_HEIGHT = uWaveHeight;
  SEA_CHOPPY = uWaveChoppy;
  SEA_BASE = uSeaBaseColor;
  SEA_WATER_COLOR = uSeaWaterColor;
  SEA_TIME = iGlobalTime * SEA_SPEED;
  
  vec2 uv = gl_FragCoord.xy / iResolution.xy; 
  uv = uv * 2.0 - 1.0;                         
  
  uv.x *= uAspectRatio;
  
  float time = iGlobalTime * 0.3;

  vec3 ang = vec3(sin(time*3.0)*0.1, sin(time)*0.2+0.3, time);
  
  vec3 ori = vec3(0.0,3.5,time*5.0);
  vec3 dir = normalize(vec3(uv.x, uv.y, -2.0));
  dir.z += length(uv) * 0.15;
  dir = normalize(dir);

  vec3 p;
  heightMapTracing(ori,dir,p);
  vec3 dist = p - ori;
  vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
  
  vec3 light = normalize(mix(vec3(0.0, 1.0, 0.8), uSunPosition, 0.8));

  vec3 sunMoonEffect = renderSunMoon(dir);
  
  vec3 skyColor = getSkyColor(dir);
  vec3 seaColor = getSeaColor(p,n,light,dir,dist);
  
  vec3 color = mix(skyColor, seaColor, pow(smoothstep(0.0,-0.05,dir.y),0.3));
  color = mix(color, sunMoonEffect, clamp(length(sunMoonEffect), 0.0, 0.95));

  gl_FragColor = vec4(pow(color,vec3(0.7)), 1.0); 
}
