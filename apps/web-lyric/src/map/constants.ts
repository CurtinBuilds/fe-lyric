import type { ColorPalette, MapState } from './types';

export const TRUE_SCALE = 8848 / 687000;

export const MAP_WIDTH = 8;
export const MAP_HEIGHT = MAP_WIDTH * (13326 / 13618); // ≈ 7.83

export const SUBDIVISIONS = 768;
export const MOBILE_SUBDIVISIONS = 384;

export const DEFAULT_PALETTE: ColorPalette = {
  c0: '#96734a',
  c1: '#6a8c5e',
  c2: '#3c7a6d',
  c3: '#4a6a7e',
  c4: '#d8dce4',
  s1: 0.05,
  s2: 0.18,
  s3: 0.77,
  s4: 1.00,
  riverColor: '#5b6c83',
  riverHighlight: '#b7d1e4',
};

export const DEFAULT_STATE: MapState = {
  displacementScale: 30 * TRUE_SCALE,
  azimuth: 155,
  elevation: 28,
  ambient: 0.92,
  diffuse: 1.30,
  normalStrength: 0.0015,
  edgeStrength: 0.38,
  edgeSharpness: 18.0,
  riverFlowSpeed: 3.0,
  riverOpacity: 1,
  texelMult: 1.0,
  palette: DEFAULT_PALETTE,
};

export const CAMERA_DEFAULT = {
  position: { x: 0, y: 10, z: 0 } as const,
  target: { x: 0, y: 0, z: 0 } as const,
  fov: 45,
  near: 0.1,
  far: 1000,
};

export const CAMERA_FLYTO_ZOOM_Y = 1.2;
export const CAMERA_FLYTO_ZOOM_Z = 2.0;
export const FLYTO_DURATION = 1.2;

export const SCENE_BG = 0xd4b07a;
