# fe-lyric

基于 React、Vite、Three.js 和 Turborepo 的诗词地形演示项目。当前应用位于 `apps/web-lyric`，以前端本地静态资源运行：地图、高程、河流遮罩、音频、字体分片都放在应用的 `public/` 目录。

## 开发

```bash
pnpm install
pnpm dev:web-lyric
```

## 构建

```bash
pnpm build:web-lyric
```

预览构建产物：

```bash
cd apps/web-lyric
pnpm preview
```

## 目录

```text
apps/web-lyric/
├── public/
│   ├── audio/
│   ├── earth-map-3857/
│   ├── fonts/
│   └── map-province-3857/
├── scripts/
└── src/
```

## 资源说明

- 运行时资源默认使用站内绝对路径，例如 `/earth-map-3857/...` 和 `/audio/...`。
- `public/fonts/` 包含页面使用的字体 CSS 和 woff2 分片，`index.html` 只引用本地字体 CSS。
- 仓库不包含 `node_modules`、`dist` 和部署产物。
