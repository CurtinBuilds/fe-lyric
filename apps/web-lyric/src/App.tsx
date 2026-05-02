import { useState, useMemo, useCallback } from 'react';
import { ControlPanel, type ControlValues } from './components/ControlPanel';
import { MapViewport } from './components/MapViewport';
import { poems, type MarkerEffect } from './data/poems';
import { DEFAULT_STATE, DEFAULT_PALETTE } from './map/constants';
import type { MapState } from './map/types';

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
  s3: DEFAULT_PALETTE.s3,
  s4: DEFAULT_PALETTE.s4,
};

export default function App() {
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

  return (
    <div className="page-shell">
      <main className="app-grid">
        <div className="left-column">
          <MapViewport
            poems={poems}
            selectedPoemId={selectedPoemId}
            onSelectPoem={setSelectedPoemId}
            debugWeatherEffect={debugWeatherEffect}
            onDebugWeatherEffectChange={setDebugWeatherEffect}
            showMarkers={controls.showMarkers}
            mapState={mapState}
          />
        </div>

        <div className="right-column">
          <ControlPanel
            poems={poems}
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
