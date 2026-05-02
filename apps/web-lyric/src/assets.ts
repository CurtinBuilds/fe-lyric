export const assets = {
  backgrounds: {
    sichuan: '/normalbg.png',
  },
  images: {
    bird: '/bird.svg',
  },
  earthMap: {
    heightmap: '/earth-map-3857/heightmap_3857_rg_half.webp',
    riverMask: '/earth-map-3857/river_mask_3857_o6.png',
    waterNormals: '/earth-map-3857/waternormals.jpg',
    chinaMask: '/earth-map-3857/china_mask_3857.geojson',
  },
  province: {
    shaanxi: {
      heightmap: '/map-province-3857/shaanxi_heightmap_rg_2048.png',
      geojson:   '/map-province-3857/shaanxi.geojson',
    },
    sichuan: {
      heightmap: '/map-province-3857/sichuan_heightmap_rg_2048.png',
      geojson:   '/map-province-3857/sichuan.geojson',
      riverMask: '/map-province-3857/sichuan_river_mask_2048.png',
    },
  },
  audio: {
    bird: '/audio/bird.mp3',
    crane: '/audio/crane.mp3',
    egret: '/audio/egret.mp3',
    goose: '/audio/goose.mp3',
    sandstorm: '/audio/sandstorm.mp3',
    smoke: '/audio/smoke.mp3',
    waterfall: '/audio/waterfall.mp3',
    windgust: '/audio/windgust.mp3',
  },
} as const;
