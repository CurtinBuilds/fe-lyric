import type { PoemMarker } from '../data/poems';

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="slider-field">
      <span>
        {label}
        <strong>{value.toFixed(step < 0.01 ? 3 : 2)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

const colorLabels: Record<string, string> = {
  c0: '低地土褐',
  c1: '丘陵青绿',
  c2: '山地青',
  c3: '高岭蓝',
  c4: '峰顶雪',
};

function ColorRow({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="color-field">
      <span>{colorLabels[id] ?? id}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export type ControlValues = {
  showMarkers: boolean;
  displacementScale: number;
  azimuth: number;
  elevation: number;
  ambient: number;
  diffuse: number;
  normalStrength: number;
  edgeStrength: number;
  edgeSharpness: number;
  riverFlowSpeed: number;
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
};

type ControlPanelProps = {
  poems: PoemMarker[];
  selectedPoemId: string | null;
  onSelectPoem: (id: string | null) => void;
  values: ControlValues;
  onChange: (partial: Partial<ControlValues>) => void;
};

export function ControlPanel({
  poems,
  selectedPoemId,
  onSelectPoem,
  values,
  onChange,
}: ControlPanelProps) {
  return (
    <aside className="control-stack">
      <section className="panel intro-panel">
        <div className="panel-heading">
          <span className="panel-kicker">New Lyric App</span>
          <h1>诗贯山河</h1>
        </div>
        <p className="panel-copy">
          3857 地形底图 · Three.js 直渲染 · 点击古诗飞到锚点
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <span className="panel-kicker">古诗点位</span>
          <h2>首批五首</h2>
        </div>
        <div className="poem-list">
          {poems.map((poem) => (
            <button
              key={poem.id}
              className={`poem-card ${selectedPoemId === poem.id ? 'active' : ''}`}
              onClick={() => onSelectPoem(poem.id)}
              type="button"
            >
              <span className="poem-card-title">{poem.title}</span>
              <span className="poem-card-meta">
                {poem.author} · {poem.locationName}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <span className="panel-kicker">显示</span>
          <h2>控制</h2>
        </div>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={values.showMarkers}
            onChange={(e) => onChange({ showMarkers: e.target.checked })}
          />
          <span>显示古诗点位</span>
        </label>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <span className="panel-kicker">地形渲染</span>
          <h2>参数调节</h2>
        </div>
        <Slider
          label="地形夸张"
          value={values.displacementScale}
          min={0.002}
          max={0.08}
          step={0.001}
          onChange={(v) => onChange({ displacementScale: v })}
        />
        <Slider
          label="光照方位"
          value={values.azimuth}
          min={0}
          max={360}
          step={1}
          onChange={(v) => onChange({ azimuth: v })}
        />
        <Slider
          label="光照仰角"
          value={values.elevation}
          min={5}
          max={85}
          step={1}
          onChange={(v) => onChange({ elevation: v })}
        />
        <Slider
          label="环境光"
          value={values.ambient}
          min={0}
          max={3}
          step={0.05}
          onChange={(v) => onChange({ ambient: v })}
        />
        <Slider
          label="漫反射"
          value={values.diffuse}
          min={0}
          max={5}
          step={0.05}
          onChange={(v) => onChange({ diffuse: v })}
        />
        <Slider
          label="法线强度"
          value={values.normalStrength}
          min={0.001}
          max={0.05}
          step={0.001}
          onChange={(v) => onChange({ normalStrength: v })}
        />
        <Slider
          label="勾线强度"
          value={values.edgeStrength}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => onChange({ edgeStrength: v })}
        />
        <Slider
          label="勾线灵敏度"
          value={values.edgeSharpness}
          min={1}
          max={30}
          step={0.5}
          onChange={(v) => onChange({ edgeSharpness: v })}
        />
        <Slider
          label="河流流速"
          value={values.riverFlowSpeed}
          min={0}
          max={3}
          step={0.05}
          onChange={(v) => onChange({ riverFlowSpeed: v })}
        />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <span className="panel-kicker">地貌配色</span>
          <h2>颜色与色阶</h2>
        </div>
        <div className="color-grid">
          <ColorRow id="c0" value={values.c0} onChange={(v) => onChange({ c0: v })} />
          <ColorRow id="c1" value={values.c1} onChange={(v) => onChange({ c1: v })} />
          <ColorRow id="c2" value={values.c2} onChange={(v) => onChange({ c2: v })} />
          <ColorRow id="c3" value={values.c3} onChange={(v) => onChange({ c3: v })} />
          <ColorRow id="c4" value={values.c4} onChange={(v) => onChange({ c4: v })} />
        </div>
        <Slider label="s1 低地→丘陵" value={values.s1} min={0} max={0.5} step={0.001} onChange={(v) => onChange({ s1: v })} />
        <Slider label="s2 丘陵→山地" value={values.s2} min={0} max={0.8} step={0.005} onChange={(v) => onChange({ s2: v })} />
        <Slider label="s3 山地→高山" value={values.s3} min={0} max={1} step={0.01} onChange={(v) => onChange({ s3: v })} />
        <Slider label="s4 高山→雪峰" value={values.s4} min={0} max={1} step={0.01} onChange={(v) => onChange({ s4: v })} />
      </section>
    </aside>
  );
}
