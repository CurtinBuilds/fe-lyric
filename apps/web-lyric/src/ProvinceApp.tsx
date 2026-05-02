import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapViewport } from './components/MapViewport';
import { ControlPanel, type ControlValues } from './components/ControlPanel';
import { poems } from './data/poems';
import { ancientPlaces } from './data/ancient-places';
import provinceMeta from './data/province-meta.json';
import { makeProvinceProjection, type Extent } from './lib/projection3857';
import { createBoundaryMaskTexture } from './map/create-land-mask-texture';
import { assets } from './assets';
import { DEFAULT_STATE, DEFAULT_PALETTE, MAP_HEIGHT } from './map/constants';
import type { MapSceneAssets } from './map/types';
import type { MarkerEffect } from './data/poems';
import type { MapState } from './map/types';

const EARTH_RADIUS = 6378137;

function lonLatToMercator(lon: number, lat: number) {
  const x = (lon * Math.PI * EARTH_RADIUS) / 180;
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI) / 360));
  return { x, y };
}

function isInsideExtent(lon: number, lat: number, extent: Extent) {
  const point = lonLatToMercator(lon, lat);
  return (
    point.x >= extent.minX &&
    point.x <= extent.maxX &&
    point.y >= extent.minY &&
    point.y <= extent.maxY
  );
}

const initialControls: ControlValues = {
  showMarkers: true,
  displacementScale: DEFAULT_STATE.displacementScale,
  azimuth: DEFAULT_STATE.azimuth,
  elevation: DEFAULT_STATE.elevation,
  ambient: DEFAULT_STATE.ambient,
  diffuse: DEFAULT_STATE.diffuse,
  normalStrength: DEFAULT_STATE.normalStrength,
  edgeStrength: DEFAULT_STATE.edgeStrength,
  edgeSharpness: DEFAULT_STATE.edgeSharpness,
  riverFlowSpeed: DEFAULT_STATE.riverFlowSpeed,
  c0: DEFAULT_PALETTE.c0,
  c1: DEFAULT_PALETTE.c1,
  c2: DEFAULT_PALETTE.c2,
  c3: DEFAULT_PALETTE.c3,
  c4: DEFAULT_PALETTE.c4,
  s1: DEFAULT_PALETTE.s1,
  s2: DEFAULT_PALETTE.s2,
  s3: 0.33,
  s4: DEFAULT_PALETTE.s4,
};

type ProvinceAppProps = {
  h5Mode?: boolean;
};

export default function ProvinceApp({ h5Mode = false }: ProvinceAppProps) {
  const { slug } = useParams<{ slug: string }>();
  const meta = (provinceMeta as Record<string, { name: string; poemIds: string[]; extent: Extent }>)[slug ?? ''];
  const [sceneAssets, setSceneAssets] = useState<MapSceneAssets | null>(null);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [debugWeatherEffect, setDebugWeatherEffect] = useState<MarkerEffect | 'auto'>('auto');
  const [controls, setControls] = useState<ControlValues>(initialControls);

  const handleControlChange = useCallback((partial: Partial<ControlValues>) => {
    setControls((prev) => ({ ...prev, ...partial }));
  }, []);

  const mapState: Partial<MapState> = useMemo(
    () => ({
      displacementScale: controls.displacementScale,
      azimuth: controls.azimuth,
      elevation: controls.elevation,
      ambient: controls.ambient,
      diffuse: controls.diffuse,
      normalStrength: controls.normalStrength,
      edgeStrength: controls.edgeStrength,
      edgeSharpness: controls.edgeSharpness,
      riverFlowSpeed: controls.riverFlowSpeed,
      riverOpacity: slug === 'sichuan' ? 2 / 3 : DEFAULT_STATE.riverOpacity,
      palette: {
        c0: controls.c0,
        c1: controls.c1,
        c2: controls.c2,
        c3: controls.c3,
        c4: controls.c4,
        s1: controls.s1,
        s2: controls.s2,
        s3: controls.s3,
        s4: controls.s4,
        riverColor: DEFAULT_PALETTE.riverColor,
        riverHighlight: DEFAULT_PALETTE.riverHighlight,
      },
    }),
    [controls],
  );

  useEffect(() => {
    if (!meta || !slug) return;
    const provinceAssets = (assets.province as Record<string, { heightmap: string; geojson: string; riverMask?: string }>)[slug];
    if (!provinceAssets) return;

    fetch(provinceAssets.geojson)
      .then(r => r.json())
      .then(geoJson => {
        const mask = createBoundaryMaskTexture(geoJson, meta.extent, 2048, 2048);
        setSceneAssets({
          heightmap: provinceAssets.heightmap,
          riverMask: provinceAssets.riverMask ?? null,
          waterNormals: assets.earthMap.waterNormals,
          landMaskTexture: mask,
        });
      });
  }, [slug]);

  if (!meta) return <div style={{ color: '#fff', padding: 20 }}>省份不存在</div>;
  if (!sceneAssets) return <div style={{ color: '#fff', padding: 20 }}>Loading...</div>;

  const poemById = new Map(poems.map((poem) => [poem.id, poem]));
  const provincePoems = meta.poemIds
    .map((id) => poemById.get(id))
    .filter((poem): poem is (typeof poems)[number] => !!poem && isInsideExtent(poem.lon, poem.lat, meta.extent));

  // Preserve the province's Mercator aspect ratio so the heightmap isn't distorted.
  // Use MAP_HEIGHT as the reference height and scale width proportionally.
  const extentW = meta.extent.maxX - meta.extent.minX;
  const extentH = meta.extent.maxY - meta.extent.minY;
  const planeDims = { width: MAP_HEIGHT * (extentW / extentH), height: MAP_HEIGHT };

  const projection = makeProvinceProjection(meta.extent, planeDims.width, planeDims.height);
  const provincePoemIds = new Set(provincePoems.map((poem) => poem.id));
  const provinceAncientPlaces = ancientPlaces.filter(place =>
    isInsideExtent(place.lon, place.lat, meta.extent) &&
    place.poemIds.some((id: string) => provincePoemIds.has(id))
  );

  const viewport = (
    <MapViewport
      poems={provincePoems}
      selectedPoemId={selectedPoemId}
      onSelectPoem={setSelectedPoemId}
      debugWeatherEffect={debugWeatherEffect}
      onDebugWeatherEffectChange={setDebugWeatherEffect}
      showMarkers={controls.showMarkers}
      mapState={mapState}
      sceneAssets={sceneAssets}
      projection={projection}
      ancientPlaces={provinceAncientPlaces}
      planeDims={planeDims}
      provinceMode
      provinceName={meta.name}
      backgroundTexture={slug === 'sichuan' ? assets.backgrounds.sichuan : undefined}
    />
  );

  if (h5Mode) {
    return <div className={`h5-shell province-page province-page--${slug}`}>{viewport}</div>;
  }

  return (
    <div className={`page-shell province-page province-page--${slug}`}>
      <main className="app-grid">
        <div className="left-column" style={{ position: 'relative' }}>
          <Link
            to="/"
            style={{
              position: 'absolute', top: 16, left: 16, zIndex: 100,
              color: '#d4b07a', textDecoration: 'none', fontSize: 14,
              background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 4,
            }}
          >
            ← 返回全图
          </Link>
          {viewport}
        </div>

        <div className="right-column">
          <ControlPanel
            poems={provincePoems}
            selectedPoemId={selectedPoemId}
            onSelectPoem={setSelectedPoemId}
            values={controls}
            onChange={handleControlChange}
          />
        </div>
      </main>
    </div>
  );
}
