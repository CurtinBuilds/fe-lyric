# fe-lyric

[English](./README.md)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2.x-ef4444.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)

`fe-lyric` 是一个诗词地形可视化项目：以 3857 地形底图为舞台，将古诗点位、古地名、天气效果、音频 cue 和 Three.js 地形渲染组合成可交互的诗词地图。

项目使用 Turborepo 管理，当前主应用位于 `apps/web-lyric`。前端运行需要的地图、高程、河流遮罩、音频、字体等资源都放在本仓库本地 `public/` 目录中，不依赖线上 CDN 才能启动。

## 预览

![四川诗词地形视图](./docs/images/showcase-sichuan.jpg)

![中国地形总览](./docs/images/showcase-china.jpg)

![诗词详情交互](./docs/images/showcase-poem.jpg)

## 特性

- Three.js 地形渲染：高程位移、河流遮罩、法线光照、边缘线和地貌色阶。
- 古诗点位交互：选择诗词后镜头聚焦到对应地理位置，并显示诗文内容。
- 古地名层：以地名标签补充诗词点位之外的历史语境。
- 天气与环境效果：雨、雪、风、沙、烟、瀑布等局部效果。
- 本地资源优先：地图、贴图、字体、音频等前端资源均随仓库提供。
- H5 路由：提供适合竖屏展示和录制的移动端视图。

## 技术栈

- React 19
- Vite 5
- TypeScript
- Three.js
- React Router
- Turborepo
- pnpm

## 快速开始

建议使用 Node.js 20 和 pnpm 9。

```bash
pnpm install
pnpm dev:web-lyric
```

默认开发地址：

```text
http://localhost:5176/
```

H5 页面：

```text
http://localhost:5176/h5
```

## 常用命令

```bash
pnpm dev:web-lyric
pnpm build:web-lyric
pnpm typecheck
```

预览构建产物：

```bash
cd apps/web-lyric
pnpm preview
```

## 项目结构

```text
.
├── apps/
│   └── web-lyric/
│       ├── public/
│       │   ├── audio/
│       │   ├── earth-map-3857/
│       │   ├── fonts/
│       │   ├── map-province-3857/
│       │   └── xhs-assets/
│       ├── scripts/
│       └── src/
├── docs/
│   └── images/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 本地资源

运行时主要资源位于：

- `apps/web-lyric/public/earth-map-3857/`
- `apps/web-lyric/public/map-province-3857/`
- `apps/web-lyric/public/audio/`
- `apps/web-lyric/public/fonts/`

资源入口集中在 `apps/web-lyric/src/assets.ts`，默认使用站内绝对路径，例如 `/earth-map-3857/...`、`/audio/...` 和 `/fonts/...`。

## 开源协议

本项目代码以 [MIT License](./LICENSE) 开源。

仓库中包含的字体、地图、高程、音频和图片等资源可能有各自的来源和授权要求。二次分发或商用前，请自行确认相关资源的许可证兼容性。

## 大资源说明

GitHub 会对大于 50MB 的文件给出提示。本项目为了保证前端资源本地可用，暂时将高程贴图直接放在仓库中；如果后续资源继续增长，建议迁移到 Git LFS 或独立资源包。
