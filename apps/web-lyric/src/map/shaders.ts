export const vertexShader = /* glsl */ `
uniform sampler2D heightMap;
uniform float displacementScale;
varying float vHeight;
varying vec2 vUv;

float decodeHeight(vec2 rg) {
  return (rg.r * 256.0 + rg.g) / 257.0;
}

void main() {
  vUv = uv;

  // 3x3 Gaussian blur at 2-texel spacing for smooth displacement
  vec2 ts = vec2(2.0 / 768.0);
  float h00 = decodeHeight(texture2D(heightMap, uv + vec2(-ts.x, -ts.y)).rg);
  float h10 = decodeHeight(texture2D(heightMap, uv + vec2(   0.0, -ts.y)).rg);
  float h20 = decodeHeight(texture2D(heightMap, uv + vec2( ts.x, -ts.y)).rg);
  float h01 = decodeHeight(texture2D(heightMap, uv + vec2(-ts.x,    0.0)).rg);
  float h11 = decodeHeight(texture2D(heightMap, uv).rg);
  float h21 = decodeHeight(texture2D(heightMap, uv + vec2( ts.x,    0.0)).rg);
  float h02 = decodeHeight(texture2D(heightMap, uv + vec2(-ts.x,  ts.y)).rg);
  float h12 = decodeHeight(texture2D(heightMap, uv + vec2(   0.0,  ts.y)).rg);
  float h22 = decodeHeight(texture2D(heightMap, uv + vec2( ts.x,  ts.y)).rg);
  float h = (h11 * 4.0 + (h10 + h01 + h21 + h12) * 2.0 + (h00 + h20 + h02 + h22)) / 16.0;

  vHeight = h;
  vec3 pos = position;
  if (h > 0.0001) pos.z += h * displacementScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
uniform sampler2D heightMap;
uniform sampler2D landMask;
uniform sampler2D riverMask;
uniform sampler2D waterNormals;
uniform vec2 riverOffset;
uniform float time;
uniform float riverFlowSpeed;
uniform vec2  texelBase;
uniform float texelMult;
uniform vec3 lightDir;
uniform vec3 c0, c1, c2, c3, c4;
uniform vec3 riverColor, riverHighlight;
uniform float ambient, diffuse, normalStrength;
uniform float riverOpacity;
uniform float s1, s2, s3, s4;
uniform float edgeStrength;
uniform float edgeSharpness;
varying float vHeight;
varying vec2 vUv;

float decodeHeight(vec2 rg) {
  return (rg.r * 256.0 + rg.g) / 257.0;
}

float sampleHeight(vec2 uv) {
  return decodeHeight(texture2D(heightMap, uv).rg);
}

float smoother(float a, float b, float x) {
  float t = clamp((x - a) / max(b - a, 1e-6), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 getColor(float h) {
  if (h < s1) return mix(c0, c1, smoother(0.0, s1, h));
  if (h < s2) return mix(c1, c2, smoother(s1, s2, h));
  if (h < s3) return mix(c2, c3, smoother(s2, s3, h));
  if (h < s4) return mix(c3, c4, smoother(s3, s4, h));
  return c4;
}

void main() {
  float hRaw = sampleHeight(vUv);
  float landMaskValue = texture2D(landMask, vUv).r;
  float landFloor = step(0.5, landMaskValue) * 0.00002;
  if (max(hRaw, landFloor) < 0.00001) discard;

  vec2 ts = texelBase * texelMult;

  // Single 3x3 sample grid — reused for normals, Sobel edges, AND color blur
  float h01 = sampleHeight(vUv - vec2(ts.x, 0.0));
  float h21 = sampleHeight(vUv + vec2(ts.x, 0.0));
  float h10 = sampleHeight(vUv - vec2(0.0, ts.y));
  float h12 = sampleHeight(vUv + vec2(0.0, ts.y));
  float h00 = sampleHeight(vUv + vec2(-ts.x, -ts.y));
  float h20 = sampleHeight(vUv + vec2( ts.x, -ts.y));
  float h02 = sampleHeight(vUv + vec2(-ts.x,  ts.y));
  float h22 = sampleHeight(vUv + vec2( ts.x,  ts.y));
  float h11 = hRaw;

  // Normal from cross samples
  vec3 normal = normalize(vec3(h01 - h21, h10 - h12, normalStrength));

  // Sobel edge detection
  float gx = -h00 - 2.0*h01 - h02 + h20 + 2.0*h21 + h22;
  float gy = -h00 - 2.0*h10 - h20 + h02 + 2.0*h12 + h22;
  float grad = length(vec2(gx, gy));
  float edgeX = grad * edgeSharpness;
  float edgeMask = edgeX / (1.0 + edgeX);
  edgeMask *= edgeMask;

  // Gaussian-weighted blur from same 9 samples (no extra texture reads)
  float hBlur = (h11 * 4.0 + (h10 + h01 + h21 + h12) * 2.0 + (h00 + h20 + h02 + h22)) / 16.0;

  float diff  = max(dot(normal, lightDir), 0.0);
  float light = clamp(ambient + diff * diffuse, 0.0, 2.5);

  vec3 color = getColor(max(hBlur, landFloor)) * light;

  // Warm sepia ink edges
  color = mix(color, vec3(0.12, 0.08, 0.05), edgeMask * edgeStrength);

  // Vignette
  vec2 vigUv = vUv - 0.5;
  float vignette = smoothstep(0.3, 1.2, length(vigUv) * 1.42);
  color *= 1.0 - vignette * 0.28;

  // River — dilate mask with 4-direction cross at 2 radii (8 samples, down from 16)
  vec2 riverUv = clamp(vUv + riverOffset, vec2(0.0), vec2(1.0));
  vec2 rts1 = texelBase * 0.67;
  vec2 rts2 = texelBase * 1.33;
  float rm = texture2D(riverMask, riverUv).r;
  rm = max(rm, max(
    max(texture2D(riverMask, riverUv + vec2( rts1.x, 0.0)).r,
        texture2D(riverMask, riverUv + vec2(-rts1.x, 0.0)).r),
    max(texture2D(riverMask, riverUv + vec2(0.0,  rts1.y)).r,
        texture2D(riverMask, riverUv + vec2(0.0, -rts1.y)).r)
  ));
  rm = max(rm, max(
    max(texture2D(riverMask, riverUv + vec2( rts2.x, 0.0)).r,
        texture2D(riverMask, riverUv + vec2(-rts2.x, 0.0)).r),
    max(texture2D(riverMask, riverUv + vec2(0.0,  rts2.y)).r,
        texture2D(riverMask, riverUv + vec2(0.0, -rts2.y)).r)
  ));
  float river = smoothstep(0.10, 0.55, rm);

  // Skip water detail when no river visible
  if (river > 0.001) {
    float shimmer = clamp(0.55 + diff * 0.45, 0.0, 1.0);
    vec2 waterUvA = riverUv * vec2(10.0, 32.0) + vec2( time * riverFlowSpeed * 0.035, -time * riverFlowSpeed * 0.110);
    vec2 waterUvB = riverUv * vec2(18.0, 22.0) + vec2(-time * riverFlowSpeed * 0.018, -time * riverFlowSpeed * 0.050);
    vec3 waterA   = texture2D(waterNormals, waterUvA).rgb;
    vec3 waterB   = texture2D(waterNormals, waterUvB).rgb;
    float ripple  = waterA.r * 0.42 + waterA.g * 0.18 + waterB.g * 0.28 + waterB.b * 0.12;
    ripple        = smoothstep(0.18, 0.86, ripple);
    float sparkle = smoothstep(0.66, 0.92, ripple);
    float riverDepth = smoothstep(0.70, 0.95, rm);
    vec3 riverCol = mix(riverColor, riverHighlight, shimmer * 0.26 + ripple * 0.38);
    riverCol = mix(riverCol, riverColor * 0.78, riverDepth * 0.35);
    color = mix(color, riverCol, river * riverOpacity);
    color += riverHighlight * river * sparkle * 0.06;
  }

  // Paper grain
  float grain = fract(sin(dot(vUv * 512.0, vec2(12.9898, 78.233))) * 43758.5453);
  color *= 0.97 + grain * 0.06;

  // Land-sea alpha
  float landAlpha = max(
    smoothstep(0.000005, 0.0004, hRaw),
    smoothstep(0.1, 0.9, landMaskValue)
  );
  gl_FragColor = vec4(color, landAlpha);
}
`;
