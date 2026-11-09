import * as THREE from 'three'

export interface CurtainUniforms {
  [uniform: string]: THREE.IUniform
  uTime: { value: number }
  uOpenProgress: { value: number }
  uSide: { value: number } // -1.0 for left, 1.0 for right
  uLightIntensity: { value: number }
  uSpotlightColor: { value: THREE.Color }
  uVelvetColor: { value: THREE.Color }
  uShadowColor: { value: THREE.Color }
}

export const curtainVertexShader = `
  uniform float uTime;
  uniform float uOpenProgress;
  uniform float uSide; // -1.0 left, 1.0 right

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vFoldDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Air current breathing wave along the drape
    float breathingWave = sin(pos.y * 0.8 + uTime * 1.5) * cos(pos.x * 0.6 + uTime * 0.8) * 0.06;
    pos.z += breathingWave * (1.0 - uOpenProgress * 0.7);

    // Realistic Accordion Bunching Physics:
    // As curtains pull to the sides, the fabric compresses towards the outer anchor.
    // Left curtain bunches towards -11.0, right curtain towards +11.0.
    float anchorX = uSide * 11.0;
    float distToAnchor = abs(pos.x - anchorX);

    // Lateral compression curve
    float compressionFactor = 1.0 - uOpenProgress * 0.78;
    pos.x = anchorX + (pos.x - anchorX) * compressionFactor;

    // As fabric bunches into less horizontal space, the fold peaks become deeper
    float foldAmplification = 1.0 + uOpenProgress * 0.85;
    pos.z *= foldAmplification;
    vFoldDepth = pos.z;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

export const curtainFragmentShader = `
  uniform float uLightIntensity;
  uniform vec3 uSpotlightColor;
  uniform vec3 uVelvetColor;
  uniform vec3 uShadowColor;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vFoldDepth;

  void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // Theater Overheard Spotlight positioning
    vec3 spotlightPos = vec3(0.0, 7.0, 5.0);
    vec3 lightDir = normalize(spotlightPos - vWorldPosition);
    float lightDist = length(spotlightPos - vWorldPosition);
    float spotlightAttenuation = clamp(1.0 - (lightDist / 20.0), 0.1, 1.0);

    // Lambertian diffuse light from spotlight
    float diff = max(dot(norm, lightDir), 0.0);

    // Velvet Optical Characteristic: Specular Sheen at Grazing Angles (Fresnel)
    float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 2.8);
    vec3 velvetSheen = vec3(0.95, 0.45, 0.55) * fresnel * 0.65;

    // Deep Crevice Shadowing in fold valleys
    float creviceShadow = smoothstep(-0.4, 0.4, vFoldDepth);
    vec3 baseColor = mix(uShadowColor, uVelvetColor, creviceShadow * 0.8 + 0.2);

    // Subtle golden rim highlight on fabric folds
    vec3 goldHighlight = vec3(0.88, 0.72, 0.45) * pow(max(dot(norm, lightDir), 0.0), 12.0) * 0.35;

    // Combine lighting model
    vec3 finalColor = baseColor * (diff * 0.75 + 0.25) * spotlightAttenuation;
    finalColor += velvetSheen * uSpotlightColor * spotlightAttenuation;
    finalColor += goldHighlight;
    finalColor *= uLightIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function createCurtainMaterial(side: 'left' | 'right'): THREE.ShaderMaterial {
  const uniforms: CurtainUniforms = {
    uTime: { value: 0 },
    uOpenProgress: { value: 0 },
    uSide: { value: side === 'left' ? -1.0 : 1.0 },
    uLightIntensity: { value: 0.1 },
    uSpotlightColor: new THREE.Uniform(new THREE.Color('#fff0d8')),
    uVelvetColor: new THREE.Uniform(new THREE.Color('#94152b')),
    uShadowColor: new THREE.Uniform(new THREE.Color('#38050e')),
  }

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: curtainVertexShader,
    fragmentShader: curtainFragmentShader,
    side: THREE.DoubleSide,
    transparent: false,
  })
}
