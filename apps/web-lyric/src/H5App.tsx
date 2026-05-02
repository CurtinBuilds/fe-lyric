import { useState, useMemo } from 'react';
import { MapViewport } from './components/MapViewport';
import { poems, type MarkerEffect } from './data/poems';
import { DEFAULT_STATE, DEFAULT_PALETTE } from './map/constants';
import type { MapState } from './map/types';

export default function H5App() {
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [debugWeatherEffect, setDebugWeatherEffect] = useState<MarkerEffect | 'auto'>('auto');

  const mapState: Partial<MapState> = useMemo(
    () => ({
      ...DEFAULT_STATE,
      palette: { ...DEFAULT_PALETTE },
    }),
    [],
  );

  return (
    <div className="h5-shell">
      <MapViewport
        poems={poems}
        selectedPoemId={selectedPoemId}
        onSelectPoem={setSelectedPoemId}
        debugWeatherEffect={debugWeatherEffect}
        onDebugWeatherEffectChange={setDebugWeatherEffect}
        showMarkers={true}
        mapState={mapState}
      />
    </div>
  );
}
