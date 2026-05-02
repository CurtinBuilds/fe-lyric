import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { vertexShader, fragmentShader } from './shaders';
import { createLandMaskTexture } from './create-land-mask-texture';
import { assets } from '../assets';
import {
  TRUE_SCALE,
  MAP_WIDTH,
  MAP_HEIGHT,
  SUBDIVISIONS,
  MOBILE_SUBDIVISIONS,
  DEFAULT_STATE,
  CAMERA_DEFAULT,
  CAMERA_FLYTO_ZOOM_Y,
  CAMERA_FLYTO_ZOOM_Z,
  FLYTO_DURATION,
  SCENE_BG,
} from './constants';
import type { MapConfig, MapSceneHandle, MapState } from './types';

// Detect mobile once — used for render quality decisions
const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

// On 120 Hz ProMotion devices rAF fires at 120 fps.
// Cap to 60 fps on desktop and 30 fps on mobile to reduce GPU heat.
const TARGET_FPS = isMobile ? 30 : 60;
const FRAME_MS = 1000 / TARGET_FPS;

function computeLightDir(azDeg: number, elDeg: number): THREE.Vector3 {
  const az = (azDeg * Math.PI) / 180;
  const el = (elDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.cos(az) * Math.cos(el),
    Math.sin(el),
  ).normalize();
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function createMapScene(
  canvas: HTMLCanvasElement,
  config: MapConfig,
): MapSceneHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_BG);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  // Cap pixel ratio at 2 — iPhone Pro Max DPR=3 would otherwise triple GPU fill cost
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const camera = new THREE.PerspectiveCamera(
    CAMERA_DEFAULT.fov,
    canvas.clientWidth / canvas.clientHeight,
    CAMERA_DEFAULT.near,
    CAMERA_DEFAULT.far,
  );
  camera.position.set(CAMERA_DEFAULT.position.x, CAMERA_DEFAULT.position.y, CAMERA_DEFAULT.position.z);
  camera.lookAt(CAMERA_DEFAULT.target.x, CAMERA_DEFAULT.target.y, CAMERA_DEFAULT.target.z);
  scene.add(camera);

  const backgroundMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: config.backgroundTexture ? 1 : 0,
    depthTest: false,
    depthWrite: false,
  });
  const backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backgroundMaterial);
  backgroundMesh.position.set(0, 0, -20);
  backgroundMesh.renderOrder = -100;
  backgroundMesh.visible = !!config.backgroundTexture;
  camera.add(backgroundMesh);
  let backgroundOpacity = config.backgroundTexture ? 1 : 0;
  let backgroundTargetOpacity = backgroundOpacity;

  function resizeBackgroundPlane() {
    const distance = Math.abs(backgroundMesh.position.z);
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    const width = height * camera.aspect;
    backgroundMesh.scale.set(width, height, 1);
  }
  resizeBackgroundPlane();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 3;
  controls.minPolarAngle = 0.1;
  controls.minDistance = 1.5;
  controls.maxDistance = 14;
  controls.target.set(CAMERA_DEFAULT.target.x, CAMERA_DEFAULT.target.y, CAMERA_DEFAULT.target.z);

  const clock = new THREE.Clock();
  const state = { ...DEFAULT_STATE };

  const loader = new THREE.TextureLoader();
  let loaded = false;

  if (config.backgroundTexture) {
    loader.load(config.backgroundTexture, (tex) => {
      configureTexture(tex);
      tex.colorSpace = THREE.SRGBColorSpace;
      backgroundMaterial.map = tex;
      backgroundMaterial.needsUpdate = true;
      needsRender = true;
    });
  }

  const uniforms: Record<string, THREE.IUniform> = {
    heightMap: { value: null },
    landMask: { value: null },
    riverMask: { value: null },
    waterNormals: { value: null },
    riverOffset: { value: new THREE.Vector2(0, 0) },
    time: { value: 0 },
    riverFlowSpeed: { value: state.riverFlowSpeed },
    displacementScale: { value: state.displacementScale },
    texelBase: { value: new THREE.Vector2() },
    texelMult: { value: state.texelMult },
    lightDir: { value: computeLightDir(state.azimuth, state.elevation) },
    ambient: { value: state.ambient },
    diffuse: { value: state.diffuse },
    normalStrength: { value: state.normalStrength },
    edgeStrength: { value: state.edgeStrength },
    edgeSharpness: { value: state.edgeSharpness },
    c0: { value: new THREE.Color(state.palette.c0) },
    c1: { value: new THREE.Color(state.palette.c1) },
    c2: { value: new THREE.Color(state.palette.c2) },
    c3: { value: new THREE.Color(state.palette.c3) },
    c4: { value: new THREE.Color(state.palette.c4) },
    s1: { value: state.palette.s1 },
    s2: { value: state.palette.s2 },
    s3: { value: state.palette.s3 },
    s4: { value: state.palette.s4 },
    riverColor: { value: new THREE.Color(state.palette.riverColor) },
    riverHighlight: { value: new THREE.Color(state.palette.riverHighlight) },
    riverOpacity: { value: state.riverOpacity },
  };

  const subdivisions = isMobile ? MOBILE_SUBDIVISIONS : SUBDIVISIONS;
  const planeW = config.planeWidth ?? MAP_WIDTH;
  const planeH = config.planeHeight ?? MAP_HEIGHT;
  const geometry = new THREE.PlaneGeometry(planeW, planeH, subdivisions, subdivisions);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);


  function configureTexture(tex: THREE.Texture, repeat = false) {
    tex.wrapS = tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.NoColorSpace;
  }

  let pending = 3;
  function onTextureLoaded() {
    pending--;
    if (pending === 0) {
      loaded = true;
      needsRender = true;
      config.onLoad?.();
    }
  }

  const ra = config.assets ?? {
    heightmap: assets.earthMap.heightmap,
    riverMask: assets.earthMap.riverMask,
    waterNormals: assets.earthMap.waterNormals,
  };
  pending = ra.riverMask !== null ? 3 : 2;

  loader.load(ra.heightmap, (tex) => {
    configureTexture(tex);
    uniforms.heightMap.value = tex;
    uniforms.texelBase.value.set(1 / tex.image.width, 1 / tex.image.height);
    uniforms.landMask.value = ra.landMaskTexture
      ?? createLandMaskTexture(tex.image.width, tex.image.height);
    onTextureLoaded();
  });

  if (ra.riverMask !== null) {
    loader.load(ra.riverMask, (tex) => {
      configureTexture(tex);
      uniforms.riverMask.value = tex;
      onTextureLoaded();
    });
  } else {
    uniforms.riverOpacity.value = 0;
  }

  loader.load(ra.waterNormals, (tex) => {
    configureTexture(tex, true);
    uniforms.waterNormals.value = tex;
    onTextureLoaded();
  });

  // flyTo animation state
  let flyAnim: {
    startPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endPos: THREE.Vector3;
    endTarget: THREE.Vector3;
    elapsed: number;
    duration: number;
    resolve: () => void;
    orbitAngle: number;
  } | null = null;

  const ORBIT_SPEED = 0.06;
  let orbiting = false;

  // Idle rendering: only render when something changed or an animation is active.
  // River animation (time uniform) still ticks at TARGET_FPS to avoid frozen water.
  let needsRender = true;
  let lastFrameTime = 0;

  // Dirty-mark when the user pans/zooms so we render the updated camera position.
  controls.addEventListener('change', () => { needsRender = true; });

  function animate(timestamp: number) {
    animId = requestAnimationFrame(animate);

    const hasBackgroundFade = Math.abs(backgroundOpacity - backgroundTargetOpacity) > 0.01;
    const isActive = !!flyAnim || orbiting || hasBackgroundFade;

    // Skip frame if idle and not enough time has elapsed for the target fps.
    // During active animations always render at full speed.
    if (!isActive && !needsRender && timestamp - lastFrameTime < FRAME_MS) return;
    lastFrameTime = timestamp;

    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.time.value = clock.elapsedTime;

    if (flyAnim) {
      flyAnim.elapsed += dt;
      const t = Math.min(flyAnim.elapsed / flyAnim.duration, 1);
      const e = easeOutCubic(t);
      camera.position.lerpVectors(flyAnim.startPos, flyAnim.endPos, e);
      controls.target.lerpVectors(flyAnim.startTarget, flyAnim.endTarget, e);

      const orbitProgress = Math.sin(t * Math.PI);
      const angle = flyAnim.orbitAngle * orbitProgress;
      const dx = camera.position.x - controls.target.x;
      const dz = camera.position.z - controls.target.z;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      camera.position.x = controls.target.x + dx * cos - dz * sin;
      camera.position.z = controls.target.z + dx * sin + dz * cos;

      if (t >= 1) {
        const resolve = flyAnim.resolve;
        flyAnim = null;
        orbiting = true;
        controls.enabled = false;
        resolve();
      }
    } else if (orbiting) {
      const angle = ORBIT_SPEED * dt;
      const dx = camera.position.x - controls.target.x;
      const dz = camera.position.z - controls.target.z;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      camera.position.x = controls.target.x + dx * cos - dz * sin;
      camera.position.z = controls.target.z + dx * sin + dz * cos;
      camera.lookAt(controls.target);
    }

    if (hasBackgroundFade) {
      const direction = backgroundTargetOpacity > backgroundOpacity ? 1 : -1;
      backgroundOpacity = THREE.MathUtils.clamp(backgroundOpacity + direction * dt * 1.4, 0, 1);
      if (Math.abs(backgroundOpacity - backgroundTargetOpacity) <= 0.01) {
        backgroundOpacity = backgroundTargetOpacity;
      }
      backgroundMaterial.opacity = backgroundOpacity;
      backgroundMesh.visible = backgroundOpacity > 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
    config.onRender?.();

    // Clear the dirty flag only when not actively animating so a static scene
    // still gets the time-uniform river tick on the next scheduled frame.
    if (!isActive) needsRender = false;
  }

  let animId = requestAnimationFrame(animate);

  // Resize handling
  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeBackgroundPlane();
    needsRender = true;
  });
  resizeObserver.observe(canvas);

  const handle: MapSceneHandle = {
    updateState(partial) {
      if (partial.displacementScale !== undefined) {
        state.displacementScale = partial.displacementScale;
        uniforms.displacementScale.value = partial.displacementScale;
      }
      if (partial.azimuth !== undefined || partial.elevation !== undefined) {
        if (partial.azimuth !== undefined) state.azimuth = partial.azimuth;
        if (partial.elevation !== undefined) state.elevation = partial.elevation;
        uniforms.lightDir.value = computeLightDir(state.azimuth, state.elevation);
      }
      if (partial.ambient !== undefined) uniforms.ambient.value = partial.ambient;
      if (partial.diffuse !== undefined) uniforms.diffuse.value = partial.diffuse;
      if (partial.normalStrength !== undefined) uniforms.normalStrength.value = partial.normalStrength;
      if (partial.edgeStrength !== undefined) uniforms.edgeStrength.value = partial.edgeStrength;
      if (partial.edgeSharpness !== undefined) uniforms.edgeSharpness.value = partial.edgeSharpness;
      if (partial.riverFlowSpeed !== undefined) uniforms.riverFlowSpeed.value = partial.riverFlowSpeed;
      if (partial.riverOpacity !== undefined) uniforms.riverOpacity.value = partial.riverOpacity;
      if (partial.texelMult !== undefined) uniforms.texelMult.value = partial.texelMult;
      if (partial.palette) {
        const p = partial.palette;
        (uniforms.c0.value as THREE.Color).set(p.c0);
        (uniforms.c1.value as THREE.Color).set(p.c1);
        (uniforms.c2.value as THREE.Color).set(p.c2);
        (uniforms.c3.value as THREE.Color).set(p.c3);
        (uniforms.c4.value as THREE.Color).set(p.c4);
        uniforms.s1.value = p.s1;
        uniforms.s2.value = p.s2;
        uniforms.s3.value = p.s3;
        uniforms.s4.value = p.s4;
        (uniforms.riverColor.value as THREE.Color).set(p.riverColor);
        (uniforms.riverHighlight.value as THREE.Color).set(p.riverHighlight);
      }
      needsRender = true;
    },

    setBackgroundVisible(visible) {
      if (!config.backgroundTexture) return;
      backgroundTargetOpacity = visible ? 1 : 0;
      backgroundMesh.visible = true;
      needsRender = true;
    },

    requestRender() {
      needsRender = true;
    },

    flyTo(worldX, worldZ, zoom) {
      return new Promise<void>((resolve) => {
        orbiting = false;
        controls.enabled = false;
        const zoomY = zoom ?? CAMERA_FLYTO_ZOOM_Y;
        flyAnim = {
          startPos: camera.position.clone(),
          startTarget: controls.target.clone(),
          endPos: new THREE.Vector3(worldX, zoomY, worldZ + CAMERA_FLYTO_ZOOM_Z),
          endTarget: new THREE.Vector3(worldX, 0, worldZ),
          elapsed: 0,
          duration: FLYTO_DURATION,
          resolve,
          orbitAngle: 0.25,
        };
      });
    },

    flyToView(pos, target) {
      return new Promise<void>((resolve) => {
        orbiting = false;
        controls.enabled = false;
        flyAnim = {
          startPos: camera.position.clone(),
          startTarget: controls.target.clone(),
          endPos: new THREE.Vector3(pos.x, pos.y, pos.z),
          endTarget: new THREE.Vector3(target.x, target.y, target.z),
          elapsed: 0,
          duration: FLYTO_DURATION,
          resolve,
          orbitAngle: 0,
        };
      });
    },

    stopOrbit() {
      orbiting = false;
      controls.enabled = true;
      needsRender = true;
    },

    resetView() {
      return handle.flyTo(
        CAMERA_DEFAULT.target.x,
        CAMERA_DEFAULT.target.z,
        CAMERA_DEFAULT.position.y,
      ).then(() => {
        handle.stopOrbit();
      });
    },

    orbitView() {
      return handle.flyToView(
        { x: 0, y: 3, z: 4 },
        { x: 0, y: 0, z: -0.5 },
      ).then(() => {
        orbiting = true;
        controls.enabled = false;
      });
    },

    projectToScreen(worldX, worldZ) {
      const v = new THREE.Vector3(worldX, 0, worldZ);
      v.project(camera);
      if (v.z > 1) return null;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return {
        x: ((v.x + 1) / 2) * w,
        y: ((-v.y + 1) / 2) * h,
      };
    },

    dispose() {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', () => { needsRender = true; });
      geometry.dispose();
      material.dispose();
      backgroundMaterial.map?.dispose();
      backgroundMaterial.dispose();
      (backgroundMesh.geometry as THREE.BufferGeometry).dispose();
      renderer.dispose();
      if (uniforms.heightMap.value) (uniforms.heightMap.value as THREE.Texture).dispose();
      if (uniforms.landMask.value) (uniforms.landMask.value as THREE.Texture).dispose();
      if (uniforms.riverMask.value) (uniforms.riverMask.value as THREE.Texture).dispose();
      if (uniforms.waterNormals.value) (uniforms.waterNormals.value as THREE.Texture).dispose();
    },
  };

  return handle;
}
