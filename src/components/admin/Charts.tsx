export function Sparkline({ data, height = 32, color = "#0B2545" }: { data: number[]; height?: number; color?: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const stepX = w / Math.max(data.length - 1, 1);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${w},${height} L 0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <path d={areaD} fill={color} fillOpacity="0.12" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChart({ data, height = 220, color = "#0B2545" }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-full w-full items-end gap-2" style={{ height }}>
      {data.map((d) => {
        const h = Math.max(4, (d.value / max) * (height - 24));
        return (
          <div key={d.label} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <div className="relative w-full">
              <div
                className="w-full rounded-t-md transition-all group-hover:opacity-80"
                style={{ height: `${h}px`, background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)` }}
                title={`${d.label}: ${d.value.toLocaleString()}`}
              />
            </div>
            <span className="truncate text-[10px] font-medium text-ink-mute dark:text-slate-500" title={d.label}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({
  series,
  height = 240,
  xLabels
}: {
  series: { name: string; color: string; data: number[] }[];
  height?: number;
  xLabels?: string[];
}) {
  if (series.length === 0 || series[0].data.length === 0) return null;
  const w = 1000;
  const h = height;
  const padX = 4;
  const padY = 16;
  const allValues = series.flatMap((s) => s.data);
  const max = Math.max(...allValues);
  const min = Math.min(0, Math.min(...allValues));
  const range = max - min || 1;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const len = series[0].data.length;
  const stepX = innerW / Math.max(len - 1, 1);

  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const y = padY + (innerH / yTicks) * i;
    const v = max - (range / yTicks) * i;
    return { y, v };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padX} y1={g.y} x2={w - padX} y2={g.y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
          <text x={w - padX} y={g.y - 2} textAnchor="end" fontSize="9" fill="currentColor" fillOpacity="0.5" className="font-mono">
            {Math.round(g.v).toLocaleString()}
          </text>
        </g>
      ))}
      {xLabels && xLabels.length === len && xLabels.filter((_, i) => i % Math.ceil(len / 6) === 0 || i === len - 1).map((label, i, arr) => {
        const realIdx = i * Math.ceil(len / 6);
        const x = padX + realIdx * stepX;
        return (
          <text key={i} x={x} y={h - 2} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.5" className="font-mono">
            {label}
          </text>
        );
      })}
      {series.map((s) => {
        const points = s.data.map((v, i) => {
          const x = padX + i * stepX;
          const y = padY + innerH - ((v - min) / range) * innerH;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        const pathD = `M ${points.join(" L ")}`;
        const areaD = `${pathD} L ${padX + (len - 1) * stepX},${padY + innerH} L ${padX},${padY + innerH} Z`;
        return (
          <g key={s.name}>
            <path d={areaD} fill={s.color} fillOpacity="0.08" />
            <path d={pathD} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ data, size = 160 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const innerR = r * 0.6;
  let cumulative = 0;
  const arcs = data.map((d) => {
    const startAngle = (cumulative / total) * Math.PI * 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * Math.PI * 2;
    const x1 = cx + r * Math.sin(startAngle);
    const y1 = cy - r * Math.cos(startAngle);
    const x2 = cx + r * Math.sin(endAngle);
    const y2 = cy - r * Math.cos(endAngle);
    const xi1 = cx + innerR * Math.sin(startAngle);
    const yi1 = cy - innerR * Math.cos(startAngle);
    const xi2 = cx + innerR * Math.sin(endAngle);
    const yi2 = cy - innerR * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1} Z`,
      color: d.color,
      label: d.label,
      value: d.value
    };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" aria-hidden="true">
      {arcs.map((a, i) => (
        <path key={i} d={a.d} fill={a.color} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.5" className="font-semibold uppercase tracking-wider">
        Total
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="18" fill="currentColor" className="font-bold">
        {total.toLocaleString()}
      </text>
    </svg>
  );
}
