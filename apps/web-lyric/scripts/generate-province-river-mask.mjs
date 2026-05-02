import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const EARTH_RADIUS = 6378137;
const SIZE = 2048;
const RIVER_WIDTH_SCALE = 2 / 3;

const PROVINCES = {
  sichuan: {
    source: '../earth-map/hydrorivers_china_o6.geojson',
    output: './public/map-province-3857/sichuan_river_mask_2048.png',
    extent: {
      minX: 10836963,
      minY: 3004763,
      maxX: 12083340,
      maxY: 4070833,
    },
  },
};

function lonLatToMercator(lon, lat) {
  const x = (lon * Math.PI * EARTH_RADIUS) / 180;
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI) / 360));
  return { x, y };
}

function projectPoint(lon, lat, extent) {
  const p = lonLatToMercator(lon, lat);
  return {
    x: ((p.x - extent.minX) / (extent.maxX - extent.minX)) * (SIZE - 1),
    y: ((extent.maxY - p.y) / (extent.maxY - extent.minY)) * (SIZE - 1),
    mx: p.x,
    my: p.y,
  };
}

function intersectsExtent(points, extent, marginMeters) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [lon, lat] of points) {
    const p = lonLatToMercator(lon, lat);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return (
    maxX >= extent.minX - marginMeters &&
    minX <= extent.maxX + marginMeters &&
    maxY >= extent.minY - marginMeters &&
    minY <= extent.maxY + marginMeters
  );
}

function riverRadius(feature) {
  const order = Number(feature.properties?.ORD_STRA ?? 1);
  const flow = Number(feature.properties?.DIS_AV_CMS ?? 0);
  let radius = 2;
  if (order >= 8 || flow >= 12000) radius = 7;
  else if (order >= 7 || flow >= 5000) radius = 6;
  else if (order >= 6 || flow >= 1800) radius = 5;
  else if (order >= 5 || flow >= 600) radius = 4;
  else if (order >= 4 || flow >= 180) radius = 3;
  return Math.max(1, radius * RIVER_WIDTH_SCALE);
}

function paintDisk(mask, cx, cy, radius, value) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(SIZE - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(SIZE - 1, Math.ceil(cy + radius));
  const rr = radius * radius;

  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= rr) {
        const i = y * SIZE + x;
        if (value > mask[i]) mask[i] = value;
      }
    }
  }
}

function paintLine(mask, a, b, radius, value) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(distance / Math.max(1, radius * 0.55)));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    paintDisk(mask, a.x + dx * t, a.y + dy * t, radius, value);
  }
}

function paintCoordinates(mask, coordinates, feature, extent) {
  if (!intersectsExtent(coordinates, extent, 20000)) return 0;

  const radius = riverRadius(feature);
  const value = radius >= 6 ? 255 : radius >= 4 ? 230 : 200;
  const projected = coordinates.map(([lon, lat]) => projectPoint(lon, lat, extent));
  let segments = 0;

  for (let i = 1; i < projected.length; i += 1) {
    const a = projected[i - 1];
    const b = projected[i];
    const margin = radius + 2;
    const outside =
      (a.x < -margin && b.x < -margin) ||
      (a.x > SIZE - 1 + margin && b.x > SIZE - 1 + margin) ||
      (a.y < -margin && b.y < -margin) ||
      (a.y > SIZE - 1 + margin && b.y > SIZE - 1 + margin);
    if (outside) continue;
    paintLine(mask, a, b, radius, value);
    segments += 1;
  }

  return segments;
}

function writeMask(mask, output) {
  const png = new PNG({ width: SIZE, height: SIZE, colorType: 6 });
  for (let i = 0; i < mask.length; i += 1) {
    const v = mask[i];
    const p = i * 4;
    png.data[p] = v;
    png.data[p + 1] = v;
    png.data[p + 2] = v;
    png.data[p + 3] = 255;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, PNG.sync.write(png));
}

function generate(slug) {
  const config = PROVINCES[slug];
  if (!config) {
    throw new Error(`Unknown province: ${slug}`);
  }

  const source = path.resolve(config.source);
  const output = path.resolve(config.output);
  const data = JSON.parse(fs.readFileSync(source, 'utf8'));
  const mask = new Uint8Array(SIZE * SIZE);
  let features = 0;
  let segments = 0;

  for (const feature of data.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    if (geometry.type === 'LineString') {
      const count = paintCoordinates(mask, geometry.coordinates, feature, config.extent);
      if (count > 0) {
        features += 1;
        segments += count;
      }
    } else if (geometry.type === 'MultiLineString') {
      for (const coordinates of geometry.coordinates) {
        const count = paintCoordinates(mask, coordinates, feature, config.extent);
        if (count > 0) {
          features += 1;
          segments += count;
        }
      }
    }
  }

  writeMask(mask, output);
  console.log(`Wrote ${output}`);
  console.log(`Rendered ${features} river features, ${segments} segments`);
}

generate(process.argv[2] ?? 'sichuan');
