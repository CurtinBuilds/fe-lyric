/**
 * 将 16-bit 灰度 heightmap 转为双通道 8-bit RG PNG
 *
 * 编码：R = highByte (value >> 8), G = lowByte (value & 0xFF)
 * Shader 解码：h = (R * 256.0 + G) / 257.0   → 0.0 ~ 1.0
 *
 * 陆地填充策略（双重保障）：
 *   1. GeoJSON mask — 中国边界内的零值像素补为 1
 *   2. BFS 膨胀 — 从所有陆地边缘出发，向外扩展 N 轮，填充沿海平原/河岸/内陆盆地
 */
import { readFileSync, writeFileSync } from 'fs';
import { decode, encode } from 'fast-png';

const SRC = './public/earth-map-3857/heightmap_3857_16bit.png';
const DST = './public/earth-map-3857/heightmap_3857_rg.png';
const META = './src/data/map-meta.json';
const MASK_GJ = './src/data/china-mask-3857.json';
const TGT_W = 4096;
const TGT_H = 4006;
// 150 轮仍会漏掉北侧和沿海的部分低地，默认提高到 260；需要时可用环境变量覆盖。
const DILATE_ROUNDS = Number(process.env.DILATE_ROUNDS || 260);

// ── 1. 读取 16-bit heightmap ────────────────────────
console.log('Reading 16-bit heightmap...');
const src = decode(readFileSync(SRC));
console.log(`Source: ${src.width}×${src.height}, depth=${src.depth}`);
if (src.depth !== 16) { console.error('Expected 16-bit'); process.exit(1); }

const srcData = src.data;
const srcW = src.width, srcH = src.height, ch = src.channels;

// ── 2. GeoJSON mask ────────────────────────────────
console.log('Reading GeoJSON mask...');
const meta = JSON.parse(readFileSync(META, 'utf-8'));
const polygons = JSON.parse(readFileSync(MASK_GJ, 'utf-8')).features[0].geometry.coordinates;
const { minX, minY, maxX, maxY } = meta.extent;
const extentW = maxX - minX, extentH = maxY - minY;

function pointInRing(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function pointInMultiPolygon(px, py) {
  for (const polygon of polygons) {
    if (pointInRing(px, py, polygon[0])) {
      let inHole = false;
      for (let h = 1; h < polygon.length; h++) {
        if (pointInRing(px, py, polygon[h])) { inHole = true; break; }
      }
      if (!inHole) return true;
    }
  }
  return false;
}

console.log(`Rasterizing ${polygons.length} polygons...`);
const geoMask = new Uint8Array(TGT_W * TGT_H);
let maskCount = 0;
for (let y = 0; y < TGT_H; y++) {
  const mercY = maxY - (y / (TGT_H - 1)) * extentH;
  for (let x = 0; x < TGT_W; x++) {
    const mercX = minX + (x / (TGT_W - 1)) * extentW;
    if (pointInMultiPolygon(mercX, mercY)) { geoMask[y * TGT_W + x] = 1; maskCount++; }
  }
  if (y % 400 === 0) console.log(`  mask row ${y}/${TGT_H}`);
}
console.log(`GeoJSON mask: ${maskCount} land pixels (${(maskCount / (TGT_W * TGT_H) * 100).toFixed(1)}%)`);

// ── 3. 降采样到目标分辨率 ──────────────────────────
function sampleBilinear(u, v) {
  const px = u * (srcW - 1), py = v * (srcH - 1);
  const x0 = Math.floor(px), y0 = Math.floor(py);
  const x1 = Math.min(srcW - 1, x0 + 1), y1 = Math.min(srcH - 1, y0 + 1);
  const tx = px - x0, ty = py - y0;
  const idx = (r, c) => (r * srcW + c) * ch;
  const top = srcData[idx(y0, x0)] * (1 - tx) + srcData[idx(y0, x1)] * tx;
  const bot = srcData[idx(y1, x0)] * (1 - tx) + srcData[idx(y1, x1)] * tx;
  return Math.round(top * (1 - ty) + bot * ty);
}

console.log('\nDownscaling...');
const heights = new Uint16Array(TGT_W * TGT_H);
for (let y = 0; y < TGT_H; y++) {
  const v = y / (TGT_H - 1);
  for (let x = 0; x < TGT_W; x++) {
    heights[y * TGT_W + x] = sampleBilinear(x / (TGT_W - 1), v);
  }
  if (y % 500 === 0) console.log(`  row ${y}/${TGT_H}`);
}

// ── 4. GeoJSON mask 填充 ───────────────────────────
let geoFilled = 0;
for (let i = 0; i < heights.length; i++) {
  if (heights[i] === 0 && geoMask[i] === 1) { heights[i] = 1; geoFilled++; }
}
console.log(`\nGeoJSON fill: ${geoFilled} pixels`);

// ── 5. BFS 膨胀（高效版）─────────────────────────
// 收集初始边界：所有与零值像素相邻的陆地像素
console.log(`\nBFS dilation (max ${DILATE_ROUNDS} rounds)...`);

const dx8 = [-1, -1, -1, 0, 0, 1, 1, 1];
const dy8 = [-1, 0, 1, -1, 1, -1, 0, 1];

// 当前边界队列：所有零值像素且至少有一个非零邻居
let frontier = [];
for (let y = 1; y < TGT_H - 1; y++) {
  for (let x = 1; x < TGT_W - 1; x++) {
    const idx = y * TGT_W + x;
    if (heights[idx] !== 0) continue;
    for (let d = 0; d < 8; d++) {
      if (heights[(y + dy8[d]) * TGT_W + (x + dx8[d])] > 0) {
        frontier.push(idx);
        break;
      }
    }
  }
}

let totalDilated = 0;
for (let round = 0; round < DILATE_ROUNDS; round++) {
  if (frontier.length === 0) {
    console.log(`  round ${round + 1}: frontier empty, stopping`);
    break;
  }

  // 填充当前 frontier
  for (const idx of frontier) heights[idx] = 1;
  totalDilated += frontier.length;

  if ((round + 1) % 20 === 0 || round === 0) {
    console.log(`  round ${round + 1}: +${frontier.length} px (total: ${totalDilated})`);
  }

  // 收集下一轮 frontier：被当前 frontier 新暴露出来的零值邻居
  const nextSet = new Set();
  for (const idx of frontier) {
    const y = Math.floor(idx / TGT_W);
    const x = idx % TGT_W;
    for (let d = 0; d < 8; d++) {
      const ny = y + dy8[d], nx = x + dx8[d];
      if (ny < 0 || ny >= TGT_H || nx < 0 || nx >= TGT_W) continue;
      const nIdx = ny * TGT_W + nx;
      if (heights[nIdx] === 0) nextSet.add(nIdx);
    }
  }
  frontier = Array.from(nextSet);
}
console.log(`BFS dilation done: ${totalDilated} pixels filled`);

// ── 6. 统计 + 编码 ────────────────────────────────
const outData = new Uint8Array(TGT_W * TGT_H * 3);
let zeroCount = 0, landCount = 0, minLand = 65535, maxLand = 0;

for (let i = 0; i < heights.length; i++) {
  const v = heights[i];
  if (v === 0) zeroCount++;
  else { landCount++; minLand = Math.min(minLand, v); maxLand = Math.max(maxLand, v); }
  const oi = i * 3;
  outData[oi] = (v >> 8) & 0xFF;
  outData[oi + 1] = v & 0xFF;
  outData[oi + 2] = 0;
}

const total = TGT_W * TGT_H;
console.log(`\nFinal stats:`);
console.log(`  Ocean:  ${zeroCount} (${(zeroCount / total * 100).toFixed(1)}%)`);
console.log(`  Land:   ${landCount} (${(landCount / total * 100).toFixed(1)}%)`);
console.log(`  Filled: ${geoFilled} (GeoJSON) + ${totalDilated} (BFS) = ${geoFilled + totalDilated}`);
console.log(`  Min land: ${minLand} (${(minLand / 65535).toFixed(6)})`);
console.log(`  Max land: ${maxLand} (${(maxLand / 65535).toFixed(6)})`);

console.log('\nEncoding RG PNG...');
const encoded = encode({ width: TGT_W, height: TGT_H, depth: 8, channels: 3, data: outData });
writeFileSync(DST, encoded);
console.log(`Done! ${DST} (${(encoded.length / 1024).toFixed(0)} KB)`);
