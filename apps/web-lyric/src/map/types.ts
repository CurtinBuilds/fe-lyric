import type * as THREE from 'three';

export type MapState = {
  displacementScale: number;
  azimuth: number;
  elevation: number;
  ambient: number;
  diffuse: number;
  normalStrength: number;
  edgeStrength: number;
  edgeSharpness: number;
  riverFlowSpeed: number;
  riverOpacity: number;
  texelMult: number;
  palette: ColorPalette;
};

export type ColorPalette = {
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  riverColor: string;
  riverHighlight: string;
};

export type MapSceneHandle = {
  updateState: (partial: Partial<MapState>) => void;
  setBackgroundVisible: (visible: boolean) => void;
  flyTo: (worldX: number, worldZ: number, zoom?: number) => Promise<void>;
  flyToView: (pos: { x: number; y: number; z: number }, target: { x: number; y: number; z: number }) => Promise<void>;
  stopOrbit: () => void;
  resetView: () => void;
  orbitView: () => Promise<void>;
  projectToScreen: (worldX: number, worldZ: number) => { x: number; y: number } | null;
  requestRender: () => void;
  dispose: () => void;
};

export type MapConfig = {
  onLoad?: () => void;
  onRender?: () => void;
  assets?: MapSceneAssets;
  planeWidth?: number;
  planeHeight?: number;
  backgroundTexture?: string;
};

export type MapSceneAssets = {
  heightmap: string;
  riverMask: string | null;
  waterNormals: string;
  landMaskTexture?: THREE.CanvasTexture;
};
