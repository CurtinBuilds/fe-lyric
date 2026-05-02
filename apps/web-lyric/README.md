# Web Lyric

React 19、Vite、Three.js 实现的诗词地形演示应用。应用运行在 Turborepo 的 `apps/web-lyric` 下，地图、高程、河流遮罩、字体、音频等前端运行资源均放在本应用的 `public/` 目录。

## 本地开发

```bash
pnpm install
pnpm dev:web-lyric
```

模块内命令：

```bash
cd apps/web-lyric
pnpm dev
pnpm build
pnpm preview
```

类型检查：

```bash
pnpm typecheck
```

## 目录结构

```text
apps/web-lyric/
├── public/
│   ├── audio/
│   ├── earth-map-3857/
│   ├── fonts/
│   ├── map-province-3857/
│   └── xhs-assets/
├── scripts/
│   ├── encode-heightmap-rg.mjs
│   └── generate-province-river-mask.mjs
└── src/
    ├── components/
    ├── data/
    ├── lib/
    └── map/
```

## 已实现能力

- Three.js 地形渲染：位移、河流、法线光照、边缘线与色阶控制
- 3857 投影：经纬度到地图世界坐标映射
- 古诗点位飞行：点击后镜头聚焦并展示诗文卡片
- 古地名层：独立于交互锚点显示
- 局部特效：`drizzle / snowfall / windgust / sandstorm / smoke / waterfall`
- 音频 cue：鸟鸣、风、烟、瀑布、沙声等本地音频资源

## 运行资源

主要资源路径：

- `public/earth-map-3857/heightmap_3857_rg_half.webp`
- `public/earth-map-3857/river_mask_3857_o6.png`
- `public/earth-map-3857/waternormals.jpg`
- `public/earth-map-3857/china_mask_3857.geojson`
- `public/audio/`
- `public/fonts/`

高程预处理脚本：

```bash
node --max-old-space-size=4096 scripts/encode-heightmap-rg.mjs
```

可调参数：

```bash
DILATE_ROUNDS=260 node --max-old-space-size=4096 scripts/encode-heightmap-rg.mjs
```

## 可选统计

默认不会注入固定第三方统计脚本。若需要百度统计，可在构建时设置：

```bash
VITE_BAIDU_TONGJI_ID=your_id pnpm build
```
