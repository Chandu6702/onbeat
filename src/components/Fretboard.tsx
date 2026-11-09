// A compact guitar chord diagram. shape is low-E to high-E:
// fret number, 0 = open, "x" = muted.
export default function Fretboard({
  shape,
  size = 46,
}: {
  shape: (number | "x")[];
  size?: number;
}) {
  const strings = 6;
  const frets = 4;
  const padX = 6;
  const padY = 8;
  const w = size;
  const gw = w - padX * 2;
  const sp = gw / (strings - 1);
  const fh = 13;
  const gh = fh * frets;
  const h = padY + gh + 10;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {/* nut */}
      <rect x={padX} y={padY} width={gw} height={4} rx={2} fill="#c9c6ff" />
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
        const x = padX + i * sp;
        if (v === "x") {
          return (
            <text key={i} x={x} y={padY - 1} fill="#6a7290" fontSize={8} textAnchor="middle">
              ×
            </text>
          );
        }
        if (v === 0) {
          return (
            <circle key={i} cx={x} cy={padY - 3} r={3} fill="none" stroke="#9aa2b8" strokeWidth={1.3} />
          );
        }
        return <circle key={i} cx={x} cy={padY + (v - 0.5) * fh} r={4.5} fill="#7c5cff" />;
      })}
    </svg>
  );
}
