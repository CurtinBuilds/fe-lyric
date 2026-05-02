import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createMapScene } from '../map/create-map-scene';
import { lonLatToWorld } from '../lib/projection3857';
import type { MapSceneHandle, MapState, MapSceneAssets } from '../map/types';
import type { MarkerEffect, PoemMarker } from '../data/poems';
import { assets } from '../assets';
import { ancientPlaces as defaultAncientPlaces } from '../data/ancient-places';
import { WeatherOverlay } from './WeatherOverlay';

type MapViewportProps = {
  poems: PoemMarker[];
  selectedPoemId: string | null;
  onSelectPoem: (id: string | null) => void;
  debugWeatherEffect: MarkerEffect | 'auto';
  onDebugWeatherEffectChange: (effect: MarkerEffect | 'auto') => void;
  showMarkers: boolean;
  mapState: Partial<MapState>;
  sceneAssets?: MapSceneAssets;
  projection?: { lonLatToWorld: (lon: number, lat: number) => { x: number; z: number } };
  ancientPlaces?: typeof defaultAncientPlaces;
  planeDims?: { width: number; height: number };
  backgroundTexture?: string;
  provinceMode?: boolean;
  provinceName?: string;
};

type ScreenPos = { x: number; y: number };
const MAX_POEM_COLUMN_CHARS = 8;
const POEM_COLLAPSE_COLUMN_THRESHOLD = 8;
const POEM_COLLAPSED_COLUMN_COUNT = 6;
const POEM_EXPANDED_COMPACT_LINE_THRESHOLD = 4;

const weatherDebugOptions: Array<{ label: string; value: MarkerEffect | 'auto' }> = [
  { label: '跟随诗词', value: 'auto' },
  { label: '无', value: 'none' },
  { label: '雨', value: 'drizzle' },
  { label: '雪', value: 'snowfall' },
  { label: '风', value: 'windgust' },
  { label: '沙', value: 'sandstorm' },
  { label: '烟', value: 'smoke' },
  { label: '瀑', value: 'waterfall' },
];

function countHanChars(text: string) {
  return text.replace(/\s/g, '').length;
}

function splitTextByPause(text: string) {
  return (text.match(/[^，、。！？；：]+[，、。！？；：]?/g) ?? [text])
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function splitSegmentToColumnLimit(segment: string) {
  const chars = Array.from(segment);
  const chunks: string[] = [];

  for (let index = 0; index < chars.length; index += MAX_POEM_COLUMN_CHARS) {
    chunks.push(chars.slice(index, index + MAX_POEM_COLUMN_CHARS).join(''));
  }

  return chunks;
}

function buildPoemColumns(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const segments = lines.flatMap(splitTextByPause).flatMap((segment) => {
    if (countHanChars(segment) <= MAX_POEM_COLUMN_CHARS) return [segment];
    return splitSegmentToColumnLimit(segment);
  });

  const columns: string[] = [];
  let current = '';
  let currentChars = 0;

  for (const segment of segments) {
    const segmentChars = countHanChars(segment);
    if (segmentChars > MAX_POEM_COLUMN_CHARS) {
      const splitChunks = splitSegmentToColumnLimit(segment);
      for (const chunk of splitChunks) {
        if (current) {
          columns.push(current);
          current = '';
          currentChars = 0;
        }
        columns.push(chunk);
      }
      continue;
    }

    if (currentChars > 0 && currentChars + segmentChars > MAX_POEM_COLUMN_CHARS) {
      columns.push(current);
      current = segment;
      currentChars = segmentChars;
      continue;
    }

    current += segment;
    currentChars += segmentChars;
  }

  if (current) columns.push(current);

  return columns;
}

function buildPoemLines(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getPoemSealText(poem: PoemMarker) {
  const authorChars = Array.from(poem.author.replace(/[·・]/g, '').trim());
  if (authorChars.length >= 2) return authorChars.slice(-2);
  const titleChars = Array.from(poem.title.replace(/[·・]/g, '').trim());
  return titleChars.slice(0, 2);
}

const POEM_BIRD_MAP: Record<string, 'egret' | 'goose' | 'bird' | 'crane'> = {
  'yellow-crane-tower': 'crane',
  'envoy-to-frontier': 'goose',
  'like-a-dream': 'egret',
  'spring-gazing': 'bird',
  'two-orioles': 'egret',
  'shu-xiang': 'bird',
  'dengao': 'bird',
  'walk-by-river-flowers': 'bird',
};

const BIRD_AUDIO_MAP: Record<string, string> = {
  crane: assets.audio.crane,
  egret: assets.audio.egret,
  goose: assets.audio.goose,
  bird: assets.audio.bird,
};

const EFFECT_AUDIO_MAP: Record<string, string> = {
  waterfall: assets.audio.waterfall,
  windgust: assets.audio.windgust,
  sandstorm: assets.audio.sandstorm,
  smoke: assets.audio.smoke,
};

const BIRD_AUDIO_DURATION = 3000;

const POEM_GROUPS = [
  {
    id: 'featured',
    label: '精选',
    poemIds: [
      'yellow-crane-tower',
      'spring-gazing',
      'waterfall-at-lushan',
      'river-snow',
      'night-mooring-maple-bridge',
      'envoy-to-frontier',
      'wuyi-lane',
      'autumn-song',
    ],
  },
  {
    id: 'landscape',
    label: '山水',
    poemIds: [
      'waterfall-at-lushan',
      'river-snow',
      'viewing-the-sea',
      'under-beigu-mountain',
      'drinking-wine',
      'gazing-at-mount-tai',
      'spring-walk-west-lake',
      'climbing-flying-peak',
      'visit-west-village',
      'dongting-lake',
      'night-mooring-maple-bridge',
      'like-a-dream',
      'road-to-shu',
      'bamboo-branch',
    ],
  },
  {
    id: 'nostalgia',
    label: '怀古',
    poemIds: [
      'yellow-crane-tower',
      'wuyi-lane',
      'west-fort-hill',
      'chibi-nostalgia',
      'red-cliff',
      'north-fort-pavilion',
      'tong-pass-nostalgia',
      'yueyang-tower',
      'youzhou-tower-song',
      'crossing-lingding',
    ],
  },
  {
    id: 'frontier',
    label: '边塞',
    poemIds: ['envoy-to-frontier', 'liangzhou-ci', 'army-march', 'white-snow-song', 'autumn-thoughts-at-frontier', 'fifteen-campaign', 'yanmen-guard'],
  },
  {
    id: 'tang',
    label: '唐',
    poemIds: [
      'farewell-du-shaofu',
      'under-beigu-mountain',
      'to-wang-changling',
      'hard-is-the-way',
      'gazing-at-mount-tai',
      'charcoal-seller',
      'thatched-hut-song',
      'white-snow-song',
      'spring-walk-west-lake',
      'yanmen-guard',
      'red-cliff',
      'moored-on-qinhuai',
      'night-rain-to-north',
      'untitled',
      'yellow-crane-tower',
      'spring-gazing',
      'envoy-to-frontier',
      'night-mooring-maple-bridge',
      'river-snow',
      'waterfall-at-lushan',
      'army-march',
      'wuyi-lane',
      'autumn-song',
      'dongting-lake',
      'bamboo-branch',
      'west-fort-hill',
      'rewarding-letian',
    ],
  },
  {
    id: 'song',
    label: '宋',
    poemIds: [
      'chibi-nostalgia',
      'autumn-thoughts-at-frontier',
      'climbing-flying-peak',
      'mizhou-hunting',
      'mid-autumn',
      'visit-west-village',
      'dream-like-fisherman',
      'like-a-dream',
      'north-fort-pavilion',
      'yueyang-tower',
      'crossing-lingding',
      'crossing-the-sea',
      'huanxisha',
    ],
  },
  {
    id: 'exam',
    label: '中考篇目',
    poemIds: [
      'guanju',
      'jianjia',
      'viewing-the-sea',
      'fifteen-campaign',
      'mulan-ballad',
      'drinking-wine',
      'farewell-du-shaofu',
      'youzhou-tower-song',
      'yellow-crane-tower',
      'under-beigu-mountain',
      'envoy-to-frontier',
      'to-wang-changling',
      'hard-is-the-way',
      'gazing-at-mount-tai',
      'spring-gazing',
      'charcoal-seller',
      'thatched-hut-song',
      'white-snow-song',
      'rewarding-letian',
      'spring-walk-west-lake',
      'yanmen-guard',
      'red-cliff',
      'moored-on-qinhuai',
      'night-rain-to-north',
      'untitled',
      'meeting-in-joy',
      'autumn-thoughts-at-frontier',
      'huanxisha',
      'climbing-flying-peak',
      'mizhou-hunting',
      'mid-autumn',
      'visit-west-village',
      'dream-like-fisherman',
      'north-fort-pavilion',
      'crossing-lingding',
      'sky-autumn-thoughts',
      'tong-pass-nostalgia',
      'ji-hai-misc',
      'manjianghong-qiujin',
    ],
  },
  {
    id: 'liuyuxi',
    label: '刘禹锡专题',
    poemIds: [
      'autumn-song',
      'wuyi-lane',
      'dongting-lake',
      'bamboo-branch',
      'west-fort-hill',
      'rewarding-letian',
    ],
  },
] as const;

type PoemGroup = {
  id: string;
  label: string;
  poemIds: readonly string[];
};

function getPoemBirdType(poem: PoemMarker): 'egret' | 'goose' | 'bird' | 'crane' | null {
  return POEM_BIRD_MAP[poem.id] ?? null;
}

function BirdSvg() {
  return (
    <img
      className="poem-paper-bird-svg"
      src={assets.images.bird}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

export function MapViewport({
  poems,
  selectedPoemId,
  onSelectPoem,
  debugWeatherEffect,
  onDebugWeatherEffectChange,
  showMarkers,
  mapState,
  sceneAssets,
  projection,
  ancientPlaces: ancientPlacesProp,
  planeDims,
  backgroundTexture,
  provinceMode = false,
  provinceName,
}: MapViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<MapSceneHandle | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [poemVisible, setPoemVisible] = useState(false);
  const placeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const positionsRef = useRef<Record<string, ScreenPos>>({});
  // Only used for weather anchor — lightweight single-value state
  const [anchorPos, setAnchorPos] = useState<ScreenPos | null>(null);
  const [orbiting, setOrbiting] = useState(false);
  const [activePoemGroupId, setActivePoemGroupId] = useState<string | null>(null);
  const [showAllPoemPlaces, setShowAllPoemPlaces] = useState(true);
  const [showPoemLabels, setShowPoemLabels] = useState(true);
  const [expandedPoemId, setExpandedPoemId] = useState<string | null>(null);
  const [backgroundVisible, setBackgroundVisible] = useState(!!backgroundTexture);

  const ancientPlaces = ancientPlacesProp ?? defaultAncientPlaces;
  const resolveWorld = projection?.lonLatToWorld ?? lonLatToWorld;

  // Refs kept in sync so the onRender callback (created once) always reads current values.
  // selectedPlaceRef is assigned after selectedPlace is computed (below).
  const selectedPlaceRef = useRef<(typeof ancientPlaces)[number] | undefined | null>(null);
  const anchorPosRef = useRef<ScreenPos | null>(null);
  // Stable ref to the onRender implementation — avoids recreating the scene when deps change
  const onRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = createMapScene(canvas, {
      onLoad: () => setLoaded(true),
      // Delegate to the ref so the implementation can be swapped without recreating the scene
      onRender: () => onRenderRef.current?.(),
      assets: sceneAssets,
      planeWidth: planeDims?.width,
      planeHeight: planeDims?.height,
      backgroundTexture,
    });
    handleRef.current = handle;

    // Project markers on every rendered frame — direct DOM writes, no React state churn.
    // Also syncs the weather anchor position, only calling setState when the value changes.
    onRenderRef.current = () => {
      const h = handleRef.current;
      if (!h) return;
      for (const place of ancientPlaces) {
        const world = resolveWorld(place.lon, place.lat);
        const screen = h.projectToScreen(world.x, world.z);
        if (screen) {
          positionsRef.current[place.id] = screen;
          const el = placeRefs.current[place.id];
          if (el) {
            el.style.transform = `translate(-50%, -50%) translate(${screen.x + (place.offsetX ?? 0)}px, ${screen.y + (place.offsetY ?? 0)}px)`;
          }
        }
      }
      const sp = selectedPlaceRef.current;
      if (sp) {
        const pos = positionsRef.current[sp.id];
        if (pos) {
          const prev = anchorPosRef.current;
          if (!prev || prev.x !== pos.x || prev.y !== pos.y) {
            const next = { x: pos.x, y: pos.y };
            anchorPosRef.current = next;
            setAnchorPos(next);
          }
        }
      }
    };

    return () => {
      onRenderRef.current = null;
      handle.dispose();
      handleRef.current = null;
    };
  }, []);

  // Sync mapState changes
  useEffect(() => {
    handleRef.current?.updateState(mapState);
  }, [mapState]);

  useEffect(() => {
    handleRef.current?.setBackgroundVisible(backgroundVisible);
  }, [backgroundVisible]);

  // Fly to selected poem
  useEffect(() => {
    if (!selectedPoemId || !handleRef.current) {
      handleRef.current?.stopOrbit();
      setPoemVisible(false);
      setExpandedPoemId(null);
      return;
    }
    setOrbiting(false);
    setShowAllPoemPlaces(true);
    setExpandedPoemId(null);
    setBackgroundVisible(false);
    const poem = poems.find((p) => p.id === selectedPoemId);
    if (!poem) return;

    setPoemVisible(false);
    const world = resolveWorld(poem.lon, poem.lat);
    handleRef.current.flyTo(world.x, world.z).then(() => {
      setPoemVisible(true);
    });
  }, [selectedPoemId]);

  useEffect(() => {
    if (!selectedPoemId || !poemVisible) return;
    const poem = poems.find((p) => p.id === selectedPoemId);
    if (!poem) return;
    const birdType = getPoemBirdType(poem);
    if (!birdType) return;
    const src = BIRD_AUDIO_MAP[birdType];
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => { });
    const timer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, BIRD_AUDIO_DURATION);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [selectedPoemId, poemVisible]);

  useEffect(() => {
    if (!selectedPoemId || !poemVisible) return;
    const poem = poems.find((p) => p.id === selectedPoemId);
    if (!poem?.effect) return;
    const src = EFFECT_AUDIO_MAP[poem.effect];
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = 0.3;
    audio.loop = true;
    audio.play().catch(() => { });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [selectedPoemId, poemVisible]);

  const handleResetView = useCallback(() => {
    handleRef.current?.resetView();
    setPoemVisible(false);
    setOrbiting(false);
    setActivePoemGroupId(null);
    setShowAllPoemPlaces(true);
    setBackgroundVisible((current) => (selectedPoemId || orbiting ? true : !current));
  }, [orbiting, selectedPoemId]);

  const handleOrbitView = useCallback(() => {
    onSelectPoem(null);
    handleRef.current?.orbitView();
    setPoemVisible(false);
    setOrbiting(true);
    setActivePoemGroupId(null);
    setShowAllPoemPlaces(true);
  }, [onSelectPoem]);

  const selectedPoem = poems.find((p) => p.id === selectedPoemId);
  const selectedPlace = selectedPoem
    ? ancientPlaces.find((place) => place.poemIds.includes(selectedPoem.id))
    : null;

  // Keep ref in sync so the onRender callback always reads the current selectedPlace
  selectedPlaceRef.current = selectedPlace;

  // Clear anchor state when the poem/place is deselected
  useEffect(() => {
    if (!selectedPlace) {
      anchorPosRef.current = null;
      setAnchorPos(null);
    }
  }, [selectedPlace?.id]);

  const selectedAnchor = anchorPos;
  const poemSegments = selectedPoem ? buildPoemColumns(selectedPoem.fullText) : [];
  const poemLines = selectedPoem ? buildPoemLines(selectedPoem.fullText) : [];
  const shouldCollapsePoem = poemSegments.length > POEM_COLLAPSE_COLUMN_THRESHOLD;
  const poemExpanded = !!selectedPoem && expandedPoemId === selectedPoem.id;
  const shouldUseCompactExpandedLayout = poemExpanded && poemLines.length <= POEM_EXPANDED_COMPACT_LINE_THRESHOLD;
  const visiblePoemSegments =
    shouldCollapsePoem && !poemExpanded
      ? poemSegments.slice(0, POEM_COLLAPSED_COLUMN_COUNT)
      : poemSegments;
  const poemSealChars = selectedPoem ? getPoemSealText(selectedPoem) : [];
  const poemBirdType = selectedPoem ? getPoemBirdType(selectedPoem) : null;
  const shouldCenterPoemBlock = visiblePoemSegments.length > 0 && visiblePoemSegments.length <= 3;
  const provincePoemGroups = useMemo<PoemGroup[]>(() => {
    const dynastyOrder = ['先秦', '汉', '三国蜀汉', '魏晋', '南北朝', '唐', '宋', '元', '明', '清', '近现代'];
    const dynastySet = new Set(poems.map((poem) => poem.dynasty));

    return Array.from(dynastySet)
      .sort((a, b) => {
        const ai = dynastyOrder.indexOf(a);
        const bi = dynastyOrder.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b, 'zh-Hans-CN');
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
      .map((dynasty) => ({
        id: `dynasty-${dynasty}`,
        label: dynasty,
        poemIds: poems.filter((poem) => poem.dynasty === dynasty).map((poem) => poem.id),
      }));
  }, [poems]);
  const bottomPoemGroups: PoemGroup[] = provinceMode ? provincePoemGroups : [...POEM_GROUPS];
  const activePoemGroup = bottomPoemGroups.find((group) => group.id === activePoemGroupId);
  const activePoemGroupIdSet: Set<string> = new Set(activePoemGroup?.poemIds ?? []);
  const activeGroupPoems = provinceMode && !activePoemGroup
    ? poems
    : (activePoemGroup?.poemIds ?? [])
      .map((id) => poems.find((poem) => poem.id === id))
      .filter((poem): poem is PoemMarker => !!poem);
  const activeWeatherEffect =
    debugWeatherEffect === 'auto' ? selectedPoem?.effect ?? 'none' : debugWeatherEffect;
  const showWeatherOverlay =
    activeWeatherEffect !== 'none' &&
    (debugWeatherEffect === 'auto' ? !!selectedPoem && poemVisible : true);

  return (
    <section className="map-shell">
      <div className="map-stage-3d">
        <canvas ref={canvasRef} className="map-canvas" />

        {!loaded && (
          <div className="map-loading">
            <span>Loading...</span>
          </div>
        )}

        <div className="map-overlay">
          <header className="map-titlebar">
            <div className="map-title-chip">
              <div className="map-title-main">
                <span>诗贯山河</span>
                {provinceMode && provinceName && (
                  <small className="map-title-province">{provinceName}篇</small>
                )}
              </div>
              <div className="map-title-sub">以诗贯山河，以词铸华夏，以墨写千古</div>
              <div className="map-title-credit">@CurtinBuilds</div>
            </div>
          </header>

          {loaded &&
            showMarkers &&
            ancientPlaces.map((place) => {
              const active = place.poemIds.includes(selectedPoemId ?? '');
              const inActiveGroup = place.poemIds.some((poemId) => activePoemGroupIdSet.has(poemId));
              const isMinor = (place.prominence ?? 'minor') === 'minor';
              if (!showAllPoemPlaces && !inActiveGroup && !active) return null;
              if (isMinor && !active && !provinceMode) return null;
              const poemsForLabel =
                showPoemLabels && (provinceMode || place.prominence === 'major')
                  ? place.poemIds
                    .map((poemId) => poems.find((poem) => poem.id === poemId))
                    .filter((poem): poem is PoemMarker => !!poem)
                  : [];
              return (
                <div
                  key={place.id}
                  ref={(el) => { placeRefs.current[place.id] = el; }}
                  className={`ancient-place ancient-place--${place.prominence ?? 'minor'} ${active ? 'active' : ''} ${poemsForLabel.length > 1 ? 'ancient-place--multi' : ''}`}
                  style={{ willChange: 'transform' }}
                >
                  {poemsForLabel.length > 0 && (
                    <div className="poem-label-stack">
                      {poemsForLabel.map((poem) => (
                        <button
                          key={poem.id}
                          className={`poem-label ${selectedPoemId === poem.id ? 'active' : ''}`}
                          onClick={() => {
                            setOrbiting(false);
                            setShowAllPoemPlaces(true);
                            onSelectPoem(
                              selectedPoemId === poem.id ? null : poem.id,
                            );
                          }}
                          type="button"
                        >
                          {poem.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className={place.orientation === 'horizontal' ? 'is-horizontal' : ''}>
                    {place.label}
                  </span>
                </div>
              );
            })}

          {showWeatherOverlay && (
            <WeatherOverlay
              key={`${selectedPoem?.id ?? 'debug'}-${activeWeatherEffect}`}
              effect={activeWeatherEffect}
              anchor={selectedAnchor}
            />
          )}

          {selectedPoem && poemVisible && (
            <article
              className={`poem-paper ${shouldCenterPoemBlock ? 'poem-paper--centered' : ''} ${poemExpanded ? 'poem-paper--expanded' : ''} ${shouldUseCompactExpandedLayout ? 'poem-paper--expanded-compact' : ''}`}
            >
              {poemBirdType && (
                <div className={`poem-paper-birds poem-paper-birds--${poemBirdType}`} aria-hidden="true">
                  <span className="poem-paper-bird poem-paper-bird--lead">
                    <BirdSvg />
                  </span>
                  <span className="poem-paper-bird poem-paper-bird--trail">
                    <BirdSvg />
                  </span>
                </div>
              )}
              <div
                className={`poem-paper-columns ${shouldCenterPoemBlock ? 'poem-paper-columns--centered' : ''}`}
              >
                <div className="poem-paper-title">{selectedPoem.title}</div>
                <div className="poem-paper-meta">
                  <div className="poem-paper-seal" aria-hidden="true">
                    {poemSealChars.map((char) => (
                      <span key={char} className="poem-paper-seal-char">
                        {char}
                      </span>
                    ))}
                  </div>
                  <div className="poem-paper-author">{selectedPoem.dynasty}·{selectedPoem.author}</div>
                </div>
                {poemExpanded ? (
                  <div className="poem-paper-body poem-paper-body--expanded">
                    {poemLines.map((line, index) => (
                      <p key={`${line}-${index}`} className="poem-paper-paragraph">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="poem-paper-body">
                    {visiblePoemSegments.map((segment, index) => (
                      <span key={`${segment}-${index}`} className="poem-paper-line">
                        {segment}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {selectedPoem && (
                <div className="poem-paper-toggle-wrap">
                  <button
                    className={`poem-paper-toggle ${poemExpanded ? 'is-expanded' : 'is-collapsed'}`}
                    onClick={() =>
                      setExpandedPoemId((current) => (current === selectedPoem.id ? null : selectedPoem.id))
                    }
                    type="button"
                  >
                    {poemExpanded ? '卷' : '阕'}
                  </button>
                </div>
              )}
            </article>
          )}

          <div className="map-bottom-bar">
            <div className="map-bottom-section">
              <span className="map-bottom-label">诗境</span>
              <div className="map-bottom-scroll">
                <button
                  className={`poem-chip ${selectedPoemId === null && !orbiting ? 'active' : ''}`}
                  onClick={() => {
                    onSelectPoem(null);
                    handleResetView();
                  }}
                  type="button"
                >
                  恢复全貌
                </button>
                <button
                  className={`poem-chip ${orbiting ? 'active' : ''}`}
                  onClick={handleOrbitView}
                  type="button"
                >
                  环绕全貌
                </button>
                <button
                  className={`poem-chip ${!showPoemLabels ? 'active' : ''}`}
                  onClick={() => {
                    setShowPoemLabels((current) => !current);
                  }}
                  type="button"
                >
                  仅地名
                </button>
                {provinceMode && (
                  <button
                    className={`poem-chip poem-chip--group ${activePoemGroupId === null ? 'active' : ''}`}
                    onClick={() => {
                      setActivePoemGroupId(null);
                      setShowAllPoemPlaces(true);
                    }}
                    type="button"
                  >
                    全部
                  </button>
                )}
                {bottomPoemGroups.map((group) => (
                  <button
                    key={group.id}
                    className={`poem-chip poem-chip--group ${activePoemGroupId === group.id ? 'active' : ''}`}
                    onClick={() => {
                      setActivePoemGroupId(group.id);
                      setShowAllPoemPlaces(false);
                    }}
                    type="button"
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>
            {(provinceMode || activePoemGroup) && (
              <div className="map-bottom-section">
                <span className="map-bottom-label">诗选</span>
                <div className="map-bottom-scroll">
                  {activeGroupPoems.length > 0 ? (
                    activeGroupPoems.map((poem) => (
                      <button
                        key={poem.id}
                        className={`poem-chip ${selectedPoemId === poem.id ? 'active' : ''}`}
                        onClick={() => {
                          setOrbiting(false);
                          setShowAllPoemPlaces(true);
                          onSelectPoem(poem.id);
                        }}
                        type="button"
                      >
                        {poem.title}
                      </button>
                    ))
                  ) : (
                    <span className="map-bottom-empty">暂无收录诗词</span>
                  )}
                </div>
              </div>
            )}
            <div className="map-bottom-section">
              <span className="map-bottom-label">天气</span>
              <div className="map-bottom-scroll">
                {weatherDebugOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`weather-chip ${debugWeatherEffect === option.value ? 'active' : ''} ${option.value === 'auto' ? 'weather-chip--ghost' : ''}`}
                    onClick={() => {
                      onDebugWeatherEffectChange(option.value);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
