import { ZONES, sevColor } from "../lib/constants";

// Top-down vehicle schematic. Highlights zones that contain faults and lets
// the user tap a zone to filter the fault list.
export function Schematic({ faults, sel, onZone, ar }) {
  const zoneSev = {};
  faults.forEach((f) => {
    if (
      !zoneSev[f.zone] ||
      f.severity === "high" ||
      (f.severity === "medium" && zoneSev[f.zone] === "low")
    ) {
      zoneSev[f.zone] = f.severity;
    }
  });

  return (
    <svg viewBox="0 0 240 290" className="schematic" role="img" aria-label="Vehicle schematic">
      {/* Body */}
      <path d="M32,168 L32,238 L208,238 L208,168 L185,102 L160,82 L80,82 L55,102 Z" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <path d="M80,82 L90,52 L150,52 L160,82 Z" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1" />
      <path d="M95,80 L102,56 L138,56 L145,80 Z" fill="var(--bg-soft)" stroke="var(--border-strong)" strokeWidth="0.8" />
      <path d="M88,150 L152,150 L155,162 L85,162 Z" fill="var(--bg-soft)" stroke="var(--border-strong)" strokeWidth="0.8" />

      {Object.keys(ZONES).map((zone) => {
        const shape = ZONES[zone];
        const sev = zoneSev[zone];
        if (!sev) return null;
        const col = sevColor(sev);
        const isSel = sel === zone;
        const common = {
          fill: col,
          fillOpacity: isSel ? 0.34 : 0.18,
          stroke: col,
          strokeWidth: isSel ? 2.5 : 1.5,
          style: { cursor: "pointer", transition: "fill-opacity .2s" },
          onClick: () => onZone(zone),
        };
        if (shape.type === "circle")
          return <circle key={zone} cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
        return <rect key={zone} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx="4" {...common} />;
      })}

      {[
        { c: "var(--crit)", l: ar ? "حرج" : "Critical" },
        { c: "var(--mod)", l: ar ? "متوسط" : "Moderate" },
        { c: "var(--minor)", l: ar ? "منخفض" : "Minor" },
      ].map((item, i) => (
        <g key={i} transform={`translate(${8 + i * 78},282)`}>
          <circle cx="5" cy="-1" r="4.5" fill={item.c} />
          <text x="13" y="3" fontSize="9" fill="var(--text-soft)" fontFamily="var(--font-body)">{item.l}</text>
        </g>
      ))}
    </svg>
  );
}
