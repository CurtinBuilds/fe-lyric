import mapMeta from '../data/map-meta.json';
import { MAP_WIDTH, MAP_HEIGHT } from '../map/constants';

const EARTH_RADIUS = 6378137;

export type Extent = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export function lonLatToMercator(lon: number, lat: number) {
  const x = EARTH_RADIUS * (lon * Math.PI / 180);
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const y =
    EARTH_RADIUS *
    Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI / 180) / 2));

  return { x, y };
}

export function mercatorToNormalized(x: number, y: number) {
  const nx = (x - mapMeta.extent.minX) / (mapMeta.extent.maxX - mapMeta.extent.minX);
  const ny = (mapMeta.extent.maxY - y) / (mapMeta.extent.maxY - mapMeta.extent.minY);

  return {
    x: Math.max(0, Math.min(1, nx)),
    y: Math.max(0, Math.min(1, ny)),
  };
}

export function normalizedToScreen(
  nx: number,
  ny: number,
  viewport: { width: number; height: number },
) {
  return {
    x: nx * viewport.width,
    y: ny * viewport.height,
  };
}

export function lonLatToNormalized(lon: number, lat: number) {
  const { x, y } = lonLatToMercator(lon, lat);
  return mercatorToNormalized(x, y);
}

export function mercatorToWorld(mercatorX: number, mercatorY: number) {
  const n = mercatorToNormalized(mercatorX, mercatorY);
  return {
    x: (n.x - 0.5) * MAP_WIDTH,
    z: (n.y - 0.5) * MAP_HEIGHT,
  };
}

export function lonLatToWorld(lon: number, lat: number) {
  const { x, y } = lonLatToMercator(lon, lat);
  return mercatorToWorld(x, y);
}

export function makeProvinceProjection(extent: Extent, planeWidth = MAP_WIDTH, planeHeight = MAP_HEIGHT) {
  return {
    lonLatToWorld(lon: number, lat: number) {
      const { x, y } = lonLatToMercator(lon, lat);
      const nx = (x - extent.minX) / (extent.maxX - extent.minX);
      const ny = (extent.maxY - y) / (extent.maxY - extent.minY);
      return {
        x: (Math.max(0, Math.min(1, nx)) - 0.5) * planeWidth,
        z: (Math.max(0, Math.min(1, ny)) - 0.5) * planeHeight,
      };
    },
  };
}
