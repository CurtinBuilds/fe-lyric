import { useMemo, type CSSProperties } from 'react';
import type { MarkerEffect } from '../data/poems';


type WeatherOverlayProps = {
  effect: MarkerEffect;
  anchor?: {
    x: number;
    y: number;
  } | null;
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateDrops(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(0, 100),
    duration: rand(0.4, 0.7),
    delay: rand(0, 1.5),
    height: rand(12, 22),
  }));
}

function generateFlakes(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(-5, 105),
    duration: rand(3.2, 8.5),
    delay: rand(0, 6),
    size: rand(2.5, 6.5),
    drift: rand(-36, 36),
    opacity: rand(0.45, 1),
  }));
}

function generateSweepStreaks(
  count: number,
  options: {
    width: [number, number];
    height: [number, number];
    top: [number, number];
    duration: [number, number];
    delay: [number, number];
    opacity: [number, number];
    driftY: [number, number];
  },
) {
  return Array.from({ length: count }, () => ({
    top: rand(...options.top),
    duration: rand(...options.duration),
    delay: rand(...options.delay),
    width: rand(...options.width),
    height: rand(...options.height),
    opacity: rand(...options.opacity),
    driftY: rand(...options.driftY),
  }));
}

function generateSmokePlumes(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(38, 54),
    bottom: rand(-2, 8),
    duration: rand(5.5, 9.5),
    delay: rand(0, 4),
    opacity: rand(0.14, 0.3),
    blur: rand(12, 20),
    scaleStart: rand(0.45, 0.72),
    scaleEnd: rand(0.95, 1.35),
    driftX: rand(-16, 18),
  }));
}

function generateWaterfallStreams(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(18, 78),
    duration: rand(0.45, 0.82),
    delay: rand(0, 1.4),
    width: rand(2, 5),
    height: rand(74, 108),
    opacity: rand(0.12, 0.3),
    sway: rand(-4, 4),
  }));
}

function generateWaterfallMist(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(5, 95),
    bottom: rand(-4, 12),
    duration: rand(1.1, 2.4),
    delay: rand(0, 2.5),
    size: rand(3, 10),
    opacity: rand(0.14, 0.38),
    drift: rand(-14, 14),
  }));
}

function generateWaterfallDrops(count: number) {
  return Array.from({ length: count }, () => ({
    left: rand(18, 82),
    bottom: rand(-2, 12),
    size: rand(0.75, 2),
    duration: rand(0.55, 1.05),
    delay: rand(0, 1.3),
    driftX: rand(-8, 8),
    rise: rand(3, 8),
    opacity: rand(0.35, 0.82),
  }));
}

export function WeatherOverlay({ effect, anchor }: WeatherOverlayProps) {
  const drops = useMemo(
    () => (effect === 'drizzle' ? generateDrops(88) : []),
    [effect],
  );
  const flakes = useMemo(
    () => (effect === 'snowfall' ? generateFlakes(104) : []),
    [effect],
  );
  const streaks = useMemo(
    () =>
      effect === 'windgust'
        ? generateSweepStreaks(42, {
            width: [72, 168],
            height: [1, 1.8],
            top: [0, 100],
            duration: [0.75, 1.5],
            delay: [0, 1.4],
            opacity: [0.08, 0.24],
            driftY: [-8, 8],
          })
        : [],
    [effect],
  );
  const grains = useMemo(
    () =>
      effect === 'sandstorm'
        ? generateSweepStreaks(128, {
            width: [18, 44],
            height: [0.7, 1.4],
            top: [5, 95],
            duration: [0.55, 1.15],
            delay: [0, 1.6],
            opacity: [0.14, 0.4],
            driftY: [-16, 2],
          })
        : [],
    [effect],
  );
  const smokePlumes = useMemo(
    () => (effect === 'smoke' ? generateSmokePlumes(8) : []),
    [effect],
  );
  const waterfallStreams = useMemo(
    () => (effect === 'waterfall' ? generateWaterfallStreams(20) : []),
    [effect],
  );
  const waterfallMist = useMemo(
    () => (effect === 'waterfall' ? generateWaterfallMist(68) : []),
    [effect],
  );
  const waterfallDrops = useMemo(
    () => (effect === 'waterfall' ? generateWaterfallDrops(22) : []),
    [effect],
  );

  if (effect === 'none') return null;

  const anchorStyle: CSSProperties = {
    left: anchor ? `${anchor.x}px` : '50%',
    top: anchor ? `${anchor.y}px` : '50%',
  };

  return (
    <div className={`weather-overlay weather-overlay--${effect}`}>
      {effect === 'drizzle' &&
        drops.map((d, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${d.left}%`,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              height: `${d.height}px`,
            }}
          />
        ))}

      {effect === 'snowfall' &&
        flakes.map((f, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              '--drift': `${f.drift}px`,
            } as CSSProperties}
          />
        ))}

      {effect === 'windgust' &&
        streaks.map((s, i) => (
          <div
            key={i}
            className="wind-streak"
            style={{
              top: `${s.top}%`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              width: `${s.width}px`,
              height: `${s.height}px`,
              opacity: s.opacity,
              '--sweep-drift-y': `${s.driftY}px`,
            } as CSSProperties}
          />
        ))}

      {effect === 'sandstorm' &&
        grains.map((g, i) => (
          <div
            key={i}
            className="sand-grain"
            style={{
              top: `${g.top}%`,
              animationDuration: `${g.duration}s`,
              animationDelay: `${g.delay}s`,
              width: `${g.width}px`,
              height: `${g.height}px`,
              opacity: g.opacity,
              '--sweep-drift-y': `${g.driftY}px`,
            } as CSSProperties}
          />
        ))}

      {effect === 'smoke' && (
        <>
          <div className="smoke-haze" />
          <div className="weather-anchor weather-anchor--smoke" style={anchorStyle}>
            <div className="smoke-column" />
            <div className="smoke-anchor-glow" />
            <div className="smoke-plume-field">
              {smokePlumes.map((plume, i) => (
                <div
                  key={i}
                  className="smoke-plume"
                  style={{
                    left: `${plume.left}%`,
                    bottom: `${plume.bottom}%`,
                    '--smoke-blur': `${plume.blur}px`,
                    '--smoke-duration': `${plume.duration}s`,
                    '--smoke-delay': `${plume.delay}s`,
                    '--smoke-opacity': plume.opacity,
                    '--smoke-scale-start': plume.scaleStart,
                    '--smoke-scale-end': plume.scaleEnd,
                    '--smoke-drift-x': `${plume.driftX}px`,
                  } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {effect === 'waterfall' && (
        <div className="weather-anchor weather-anchor--waterfall" style={anchorStyle}>
          <div className="waterfall-source" />
          <div className="waterfall-body">
            <div className="waterfall-glow" />
            <div className="waterfall-core" />
            <div className="waterfall-sheen" />
            {waterfallStreams.map((stream, i) => (
              <div
                key={i}
                className="waterfall-stream"
                style={{
                  left: `${stream.left}%`,
                  width: `${stream.width}px`,
                  height: `${stream.height}%`,
                  opacity: stream.opacity,
                  animationDuration: `${stream.duration}s`,
                  animationDelay: `${stream.delay}s`,
                  '--stream-sway': `${stream.sway}px`,
                } as CSSProperties}
              />
            ))}
          </div>
          <div className="waterfall-mist">
            {waterfallMist.map((mist, i) => (
              <div
                key={i}
                className="waterfall-spray"
                style={{
                  left: `${mist.left}%`,
                  bottom: `${mist.bottom}%`,
                  width: `${mist.size}px`,
                  height: `${mist.size}px`,
                  opacity: mist.opacity,
                  animationDuration: `${mist.duration}s`,
                  animationDelay: `${mist.delay}s`,
                  '--mist-drift': `${mist.drift}px`,
                } as CSSProperties}
              />
            ))}
            {waterfallDrops.map((drop, i) => (
              <div
                key={`drop-${i}`}
                className="waterfall-drop"
                style={{
                  left: `${drop.left}%`,
                  bottom: `${drop.bottom}%`,
                  width: `${drop.size}px`,
                  height: `${drop.size * 1.4}px`,
                  opacity: drop.opacity,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                  '--drop-drift-x': `${drop.driftX}px`,
                  '--drop-rise': `${drop.rise}px`,
                } as CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
