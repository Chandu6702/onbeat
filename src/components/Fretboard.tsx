"use client";

import { useSettings } from "@/state/settings";
import { useHasHydrated } from "@/state/progress";

// A compact guitar chord diagram. shape is low-E to high-E:
// fret number, 0 = open, "x" = muted. Everything scales off `size`, so the
// same component renders a tiny library thumbnail or a large detail diagram.
// Pass `fingers` (aligned to shape, 1–4) to print finger numbers inside dots.
// Respects the left-handed setting (mirrors which string each marker sits on).
export default function Fretboard({
  shape,
  size = 46,
  fingers,
}: {
  shape: (number | "x")[];
  size?: number;
  fingers?: (number | null)[];
}) {
  const hydrated = useHasHydrated();
  const lefty = useSettings((s) => s.lefty) && hydrated;
  const strings = 6;
  const frets = 4;
  const padX = size * 0.13;
  const padY = size * 0.17;
  const w = size;
  const gw = w - padX * 2;
  const sp = gw / (strings - 1);
  const fh = size * 0.28;
  const gh = fh * frets;
  const h = padY + gh + size * 0.22;

  const r = sp * 0.66; // pressed-note dot radius
  const openR = Math.max(2.4, r * 0.62);
  const nutH = Math.max(3, size * 0.085);
  const markFont = r * 1.15;
  const symFont = Math.max(7, r * 1.6);
  const showFingers = !!fingers && r >= 7; // only when the dot is big enough to read

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {/* nut */}
      <rect x={padX} y={padY} width={gw} height={nutH} rx={nutH / 2} fill="#c9c6ff" />
      {/* frets */}
      {Array.from({ length: frets + 1 }, (_, f) => (
        <line
          key={`f${f}`}
          x1={padX}
          y1={padY + f * fh}
          x2={padX + gw}
          y2={padY + f * fh}
          stroke="#2c3350"
          strokeWidth={1.5}
        />
      ))}
      {/* strings */}
      {Array.from({ length: strings }, (_, i) => (
        <line
          key={`s${i}`}
          x1={padX + i * sp}
          y1={padY}
          x2={padX + i * sp}
          y2={padY + gh}
          stroke="#2c3350"
          strokeWidth={1.5}
        />
      ))}
      {/* markers */}
      {shape.map((v, i) => {
        const x = padX + (lefty ? strings - 1 - i : i) * sp;
        if (v === "x") {
          return (
            <text key={i} x={x} y={padY - openR} fill="#6a7290" fontSize={symFont} textAnchor="middle">
              ×
            </text>
          );
        }
        if (v === 0) {
          return (
            <circle
              key={i}
              cx={x}
              cy={padY - openR - 1}
              r={openR}
              fill="none"
              stroke="#9aa2b8"
              strokeWidth={1.3}
            />
          );
        }
        const cy = padY + (v - 0.5) * fh;
        const finger = fingers?.[i];
        return (
          <g key={i}>
            <circle cx={x} cy={cy} r={r} fill="#7c5cff" />
            {showFingers && finger != null && (
              <text
                x={x}
                y={cy}
                fill="#fff"
                fontSize={markFont}
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
