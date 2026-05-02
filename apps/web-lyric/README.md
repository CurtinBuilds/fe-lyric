# Web Lyric

[简体中文](./README.zh-CN.md)

`web-lyric` is the main frontend app in the `fe-lyric` Turborepo. It uses React 19, Vite, and Three.js to render an interactive poetry terrain map.

## Showcase

![Sichuan poetry terrain view](../../docs/images/showcase-sichuan.jpg)

![Poem detail interaction](../../docs/images/showcase-poem.jpg)

## Development

Run from the repository root:

```bash
pnpm install
pnpm dev:web-lyric
```

App-level commands:

```bash
cd apps/web-lyric
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
```

## Capabilities

- Three.js terrain rendering with displacement, river masks, normal lighting, edge lines, and color ramps.
- EPSG:3857 projection from longitude and latitude to map-world coordinates.
- Poem-point camera flights with poem cards.
- Historical place-name labels independent from poem interaction anchors.
- Local weather effects: `drizzle / snowfall / windgust / sandstorm / smoke / waterfall`.
- Local audio cues for birds, wind, smoke, waterfall, sand, and related ambience.

## Layout

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

## Runtime Assets

Primary asset paths:

- `public/earth-map-3857/heightmap_3857_rg_half.webp`
- `public/earth-map-3857/river_mask_3857_o6.png`
- `public/earth-map-3857/waternormals.jpg`
- `public/earth-map-3857/china_mask_3857.geojson`
- `public/audio/`
- `public/fonts/`

Heightmap preprocessing:

```bash
node --max-old-space-size=4096 scripts/encode-heightmap-rg.mjs
```

Optional parameter:

```bash
DILATE_ROUNDS=260 node --max-old-space-size=4096 scripts/encode-heightmap-rg.mjs
```

## License

Project code follows the repository-level [MIT License](../../LICENSE). Fonts, maps, terrain textures, audio, and image assets may have separate license requirements.
