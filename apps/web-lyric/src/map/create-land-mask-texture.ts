import * as THREE from 'three';
import chinaMask3857 from '../data/china-mask-3857.json';
import mapMeta from '../data/map-meta.json';
import { lonLatToMercator, type Extent } from '../lib/projection3857';

type Ring = number[][];
type Polygon = Ring[];

const polygons = chinaMask3857.features[0].geometry.coordinates as Polygon[];
const { minX, minY, maxX, maxY } = mapMeta.extent;
const extentW = maxX - minX;
const extentH = maxY - minY;

function projectPoint(x: number, y: number, width: number, height: number) {
  return {
    x: ((x - minX) / extentW) * (width - 1),
    y: ((maxY - y) / extentH) * (height - 1),
  };
}

export function createLandMaskTexture(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create 2D context for land mask texture');
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';

  for (const polygon of polygons) {
    ctx.beginPath();
    for (const ring of polygon) {
      if (ring.length === 0) continue;
      for (let i = 0; i < ring.length; i++) {
        const [mercX, mercY] = ring[i];
        const p = projectPoint(mercX, mercY, width, height);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
    }
    ctx.fill('evenodd');
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

export function createBoundaryMaskTexture(
  geoJson: { features: Array<{ geometry: { coordinates: number[][][][] } }> },
  extent: Extent,
  width: number,
  height: number,
) {
  const extentW = extent.maxX - extent.minX;
  const extentH = extent.maxY - extent.minY;

  function projectPoint(lon: number, lat: number) {
    const { x: mx, y: my } = lonLatToMercator(lon, lat);
    return {
      x: ((mx - extent.minX) / extentW) * (width - 1),
      y: ((extent.maxY - my) / extentH) * (height - 1),
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create 2D context for boundary mask texture');
  }
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';

  for (const feature of geoJson.features) {
    for (const polygon of feature.geometry.coordinates) {
      ctx.beginPath();
      for (const ring of polygon) {
        for (let i = 0; i < ring.length; i++) {
          const p = projectPoint(ring[i][0], ring[i][1]);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
      }
      ctx.fill('evenodd');
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}
