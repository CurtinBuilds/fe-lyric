# fe-lyric

[简体中文](./README.zh-CN.md)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2.x-ef4444.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)

`fe-lyric` is an interactive poetry-and-terrain visualization project. It uses a 3857 projected terrain map as the stage, then layers classical Chinese poem locations, historical place names, weather effects, audio cues, and Three.js terrain rendering into a lyric map experience.

The repository is organized as a Turborepo workspace. The main app lives in `apps/web-lyric`. Runtime frontend assets, including terrain textures, map masks, audio, and font shards, are kept locally under `public/` so the app can run without depending on a CDN.

## Showcase

<table>
  <tr>
    <td width="33.33%"><img src="./docs/images/showcase-sichuan.jpg" alt="Sichuan poetry terrain view" /></td>
    <td width="33.33%"><img src="./docs/images/showcase-china.jpg" alt="China terrain overview" /></td>
    <td width="33.33%"><img src="./docs/images/showcase-poem.jpg" alt="Poem detail interaction" /></td>
  </tr>
  <tr>
    <td align="center">Sichuan terrain</td>
    <td align="center">China overview</td>
    <td align="center">Poem detail</td>
  </tr>
</table>

## Features

- Three.js terrain rendering with displacement, river masks, normals, edge lines, and terrain color ramps.
- Poem location interaction with camera focus and poem cards.
- Historical place-name labels that add context beyond poem anchor points.
- Weather and ambience effects including rain, snow, wind, sand, smoke, and waterfall states.
- Local-first frontend assets: maps, textures, fonts, and audio are committed with the project.
- H5-friendly routes for vertical presentation and screen recording.

## Stack

- React 19
- Vite 5
- TypeScript
- Three.js
- React Router
- Turborepo
- pnpm

## Quick Start

Node.js 20 and pnpm 9 are recommended.

```bash
pnpm install
pnpm dev:web-lyric
```

Default local URL:

```text
http://localhost:5176/
```

H5 route:

```text
http://localhost:5176/h5
```

## Commands

```bash
pnpm dev:web-lyric
pnpm build:web-lyric
pnpm typecheck
```

Preview a production build:

```bash
cd apps/web-lyric
pnpm preview
```

## Project Layout

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

## Local Assets

Main runtime assets are stored in:

- `apps/web-lyric/public/earth-map-3857/`
- `apps/web-lyric/public/map-province-3857/`
- `apps/web-lyric/public/audio/`
- `apps/web-lyric/public/fonts/`

Asset paths are centralized in `apps/web-lyric/src/assets.ts` and use site-root paths such as `/earth-map-3857/...`, `/audio/...`, and `/fonts/...`.

## License

The project code is released under the [MIT License](./LICENSE).

Fonts, map data, terrain textures, audio, and image assets included in this repository may have their own source and licensing requirements. Please verify asset licenses before redistribution or commercial use.

## Large Assets

GitHub warns when files are larger than 50 MB. This project keeps terrain assets in the repository so the frontend remains fully local-first. If the asset set grows further, Git LFS or a separate asset package is recommended.
