import * as THREE from "three"

/**
 * Sistema visual “iridiscente procedural” compartido por todos los modelos 3D de este estilo.
 *
 * Capas (de fondo a frente):
 * 1. Base casi negra (obsidiana) — ancla el contraste.
 * 2. Reflexión falsa — función `environment(reflectDir)`: cielo procedural con blobs de color
 *    (ámbar, azul, púrpura, teal, rosa) que se mueven lentamente con el tiempo; sin HDRI externo.
 * 3. Fresnel — bordes más reflectantes que el centro (Schlick, f0 bajo).
 * 4. Iridiscencia tipo película delgada — interferencia RGB según ángulo y ruido en la normal.
 * 5. Micro-ruido en la superficie — variación sutil vía `snoise` sobre la normal.
 *
 * Lo que CAMBIA entre formas (esfera, cubo, nube, etc.): la geometría y los `normal` del mesh
 * (vértice shader igual: world pos, N, V, R). El fragment shader puede reutilizarse tal cual.
 *
 * Renderer: ACES tone mapping + exposure 1; fondo negro.
 */

export const IRIDESCENT_SNOISE_GLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`

export const IRIDESCENT_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vReflect;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    vReflect = reflect(-vViewDir, vNormal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

/** Entorno procedural compartido (GLSL). */
const ENVIRONMENT_GLSL = `
  vec3 environment(vec3 dir, float time) {
    vec3 env = vec3(0.005);

    vec3 warmCenter = normalize(vec3(0.8 + sin(time*0.12)*0.3, 0.6 + cos(time*0.08)*0.2, 0.3));
    float warmBlob = smoothstep(0.4, 0.85, dot(dir, warmCenter));
    float warmNoise = snoise(dir*2.0 + time*0.05) * 0.3;
    warmBlob *= (1.0 + warmNoise);
    env += vec3(0.95, 0.55, 0.12) * max(warmBlob, 0.0) * 2.5;

    vec3 blueCenter = normalize(vec3(-0.3 + sin(time*0.1)*0.2, -0.2 + cos(time*0.07)*0.3, 0.9));
    float blueBlob = smoothstep(0.3, 0.8, dot(dir, blueCenter));
    float blueNoise = snoise(dir*1.8 + vec3(100.0) + time*0.04) * 0.25;
    blueBlob *= (1.0 + blueNoise);
    env += vec3(0.08, 0.2, 0.85) * max(blueBlob, 0.0) * 3.0;

    vec3 purpCenter = normalize(vec3(-0.7 + cos(time*0.09)*0.2, 0.3 + sin(time*0.11)*0.2, -0.5));
    float purpBlob = smoothstep(0.45, 0.82, dot(dir, purpCenter));
    float purpNoise = snoise(dir*2.2 + vec3(200.0) + time*0.06) * 0.2;
    purpBlob *= (1.0 + purpNoise);
    env += vec3(0.5, 0.1, 0.7) * max(purpBlob, 0.0) * 2.0;

    vec3 tealCenter = normalize(vec3(0.2 + sin(time*0.13)*0.3, -0.8, -0.3 + cos(time*0.1)*0.2));
    float tealBlob = smoothstep(0.5, 0.85, dot(dir, tealCenter));
    float tealNoise = snoise(dir*2.5 + vec3(300.0) + time*0.07) * 0.2;
    tealBlob *= (1.0 + tealNoise);
    env += vec3(0.05, 0.6, 0.55) * max(tealBlob, 0.0) * 1.8;

    vec3 pinkCenter = normalize(vec3(0.5, -0.4 + sin(time*0.08)*0.2, -0.7 + cos(time*0.12)*0.2));
    float pinkBlob = smoothstep(0.55, 0.88, dot(dir, pinkCenter));
    env += vec3(0.8, 0.2, 0.5) * pinkBlob * 1.5;

    return env;
  }
`

function buildIridescentFragmentShader(): string {
  return `
      ${IRIDESCENT_SNOISE_GLSL}

      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec3 vReflect;

      #define PI 3.14159265359

      float fresnelSchlick(float cosT, float f0) {
        return f0 + (1.0 - f0) * pow(1.0 - cosT, 5.0);
      }

      ${ENVIRONMENT_GLSL}

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        vec3 R = normalize(vReflect);
        float NdotV = max(dot(N, V), 0.0);
        float t = uTime;

        vec3 baseColor = vec3(0.008, 0.008, 0.012);
        vec3 reflection = environment(R, t);

        float fres = fresnelSchlick(NdotV, 0.06);
        float reflStrength = mix(0.15, 1.0, fres);

        float filmThickness = 0.35 + snoise(N*3.0 + t*0.03) * 0.15;
        float opd = 2.0 * 1.5 * filmThickness * NdotV;

        vec3 thinFilm;
        thinFilm.r = pow(cos(2.0*PI*opd/0.620*0.5), 2.0);
        thinFilm.g = pow(cos(2.0*PI*opd/0.530*0.5), 2.0);
        thinFilm.b = pow(cos(2.0*PI*opd/0.460*0.5), 2.0);

        float reflLum = dot(reflection, vec3(0.299, 0.587, 0.114));
        float iriMask = smoothstep(0.05, 0.3, reflLum) * smoothstep(0.8, 0.4, reflLum);
        vec3 iridescence = thinFilm * iriMask * 0.25 * fres;

        float surfaceNoise = 1.0 + snoise(N*4.0 + t*0.02) * 0.03;

        vec3 color = baseColor;
        color += reflection * reflStrength;
        color += iridescence;
        color *= surfaceNoise;

        gl_FragColor = vec4(color, 1.0);
      }
    `
}

/**
 * Variante "cristal oscuro / jabón":
 * - Centro casi negro.
 * - Highlights de estudio principalmente blancos.
 * - Iridiscencia arcoíris muy localizada en bordes/reflejos, no como relleno.
 */
function buildCrystalFragmentShader(): string {
  return `
      ${IRIDESCENT_SNOISE_GLSL}

      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec3 vReflect;

      #define PI 3.14159265359

      float fresnelSchlick(float cosT, float f0) {
        return f0 + (1.0 - f0) * pow(1.0 - cosT, 5.0);
      }

      vec3 rainbowPalette(float t) {
        return 0.5 + 0.5 * cos(6.28318 * (vec3(t) + vec3(0.0, 0.18, 0.36)));
      }

      vec3 studioHighlights(vec3 dir) {
        vec3 keyDir = normalize(vec3(0.85, 0.28, 0.42));
        vec3 fillDir = normalize(vec3(-0.55, 0.45, 0.68));
        vec3 rimDir = normalize(vec3(0.18, -0.92, 0.36));

        float key = pow(max(dot(dir, keyDir), 0.0), 90.0);
        float fill = pow(max(dot(dir, fillDir), 0.0), 120.0);
        float rim = pow(max(dot(dir, rimDir), 0.0), 180.0);

        return vec3(1.0, 0.985, 0.97) * key * 1.4
          + vec3(0.96, 0.98, 1.0) * fill * 0.9
          + vec3(1.0) * rim * 0.6;
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        vec3 R = normalize(vReflect);
        float NdotV = max(dot(N, V), 0.0);
        float t = uTime;

        // Fresnel pronunciado: mantiene el centro oscuro y activa los bordes.
        float fres = fresnelSchlick(NdotV, 0.04);
        float edge = pow(1.0 - NdotV, 4.2);

        // Highlights de estudio, mayormente blancos.
        vec3 highlights = studioHighlights(R);

        // Película delgada — iridiscencia jabonosa localizada.
        float filmThickness = 0.22 + snoise(N * 2.2 + t * 0.02) * 0.08;
        float opd = 2.0 * 1.33 * filmThickness * (1.0 - NdotV);

        vec3 thinFilm;
        thinFilm.r = pow(cos(2.0 * PI * opd / 0.650 * 0.5), 2.0);
        thinFilm.g = pow(cos(2.0 * PI * opd / 0.530 * 0.5), 2.0);
        thinFilm.b = pow(cos(2.0 * PI * opd / 0.440 * 0.5), 2.0);

        // Patrón espectral muy puntual, atado al ángulo del reflejo.
        float band = fract(dot(normalize(R + vec3(0.001)), vec3(0.63, -0.41, 0.52)) * 3.0 + t * 0.01);
        vec3 spectral = rainbowPalette(band);

        // Base prácticamente negra; sobre fondo negro se percibe casi transparente.
        vec3 color = vec3(0.0025, 0.0025, 0.004);

        // Blanco especular fuerte y limpio.
        color += highlights * (0.25 + edge * 0.95);

        // Arcoíris muy contenido, como capa jabonosa sobre el borde.
        color += thinFilm * spectral * edge * 0.22;

        // Refuerzo puntual en algunos reflejos para ese destello prismático.
        float prismMask = pow(max(dot(R, normalize(vec3(-0.38, 0.74, 0.56))), 0.0), 24.0);
        color += spectral * prismMask * edge * 0.35;

        // Variación superficial muy sutil
        float surfNoise = 1.0 + snoise(N * 4.5 + t * 0.015) * 0.012;
        color *= surfNoise;

        gl_FragColor = vec4(color, 1.0);
      }
    `
}

/** Material para formas suaves (esfera, nube) — iridiscencia sutil. */
export function createIridescentShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: IRIDESCENT_VERTEX_SHADER,
    fragmentShader: buildIridescentFragmentShader(),
    uniforms: {
      uTime: { value: 0 },
    },
  })
}

/** Material cristal/diamante — dispersión prismática + iridiscencia fuerte tipo jabón. */
export function createCrystalShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: IRIDESCENT_VERTEX_SHADER,
    fragmentShader: buildCrystalFragmentShader(),
    flatShading: true,
    uniforms: {
      uTime: { value: 0 },
    },
  })
}
