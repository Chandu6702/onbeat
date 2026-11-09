"use client";

import { useHasHydrated } from "@/state/progress";
import { useSettings, type Theme } from "@/state/settings";
import type { InstrumentType } from "@/audio/instruments";

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel p-4">
      <div className="min-w-0">
        <div className="text-[14.5px] font-semibold">{title}</div>
        <div className="mt-0.5 text-[12.5px] leading-snug text-muted">{desc}</div>
      </div>
      <div className="flex-none">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-accent" : "bg-panel-2 border border-line"}`}
    >
      <span
        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-all ${
          on ? "left-[26px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const hydrated = useHasHydrated();
  const {
    theme,
    lefty,
    countIn,
    metronomeVolume,
    transpose,
    instrument,
    setTheme,
    toggleLefty,
    toggleCountIn,
    setMetronomeVolume,
    setTranspose,
    setInstrument,
  } = useSettings();

  const volPct = Math.round(metronomeVolume * 100);
  const t = hydrated ? transpose : 0;
  const transposeLabel = t === 0 ? "Off" : t > 0 ? `Capo ${t}` : `${t} semitones`;

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Settings</h1>
      <p className="mt-1.5 text-[13.5px] text-muted">
        Make Onbeat fit how you play. Saved on this device.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Row title="Theme" desc="Dark is easy on the eyes; light suits bright rooms.">
          <div className="inline-flex gap-1 rounded-xl border border-line bg-panel-2 p-1">
            {(["dark", "light"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold capitalize transition ${
                  (hydrated ? theme : "dark") === t ? "bg-accent text-white" : "text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Row>

        <Row title="Guitar sound" desc="Acoustic is warm and woody; electric is brighter with a little drive.">
          <div className="inline-flex gap-1 rounded-xl border border-line bg-panel-2 p-1">
            {(["acoustic", "electric"] as InstrumentType[]).map((i) => (
              <button
                key={i}
                onClick={() => setInstrument(i)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold capitalize transition ${
                  (hydrated ? instrument : "acoustic") === i ? "bg-accent text-white" : "text-muted"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </Row>

        <Row title="Left-handed fretboards" desc="Mirror every chord diagram for a left-handed guitar.">
          <Toggle on={hydrated && lefty} onChange={toggleLefty} label="Left-handed fretboards" />
        </Row>

        <Row title="Count-in" desc="A free bar of clicks before play-along and drills start.">
          <Toggle on={hydrated ? countIn : true} onChange={toggleCountIn} label="Count-in" />
        </Row>

        <div className="rounded-2xl border border-line bg-panel p-4">
          <div className="flex items-baseline justify-between">
            <div className="text-[14.5px] font-semibold">Metronome volume</div>
            <span className="font-display text-[16px] font-bold">{hydrated ? volPct : 80}%</span>
          </div>
          <div className="mt-0.5 text-[12.5px] text-muted">How loud the click is under the music.</div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={hydrated ? volPct : 80}
            onChange={(e) => setMetronomeVolume(Number(e.target.value) / 100)}
            className="mt-3 w-full"
            style={{
              background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${
                hydrated ? volPct : 80
              }%, #262c40 ${hydrated ? volPct : 80}%)`,
            }}
          />
        </div>

        <Row
          title="Capo / transpose"
          desc="Change key without new shapes — play the same chords, hear them higher or lower."
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTranspose(Math.max(-5, t - 1))}
              disabled={t <= -5}
              aria-label="Lower"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel-2 text-lg font-bold text-fg disabled:opacity-40"
            >
              −
            </button>
            <span className="w-[92px] text-center font-display text-[13.5px] font-bold">
              {transposeLabel}
            </span>
            <button
              onClick={() => setTranspose(Math.min(7, t + 1))}
              disabled={t >= 7}
              aria-label="Raise"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel-2 text-lg font-bold text-fg disabled:opacity-40"
            >
              +
            </button>
          </div>
        </Row>
      </div>

      <p className="mt-6 text-center text-xs text-faint">More options coming — A–B loop, tempo trainer.</p>
    </>
  );
}
