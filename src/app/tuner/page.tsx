"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  autoCorrelate,
  centsOff,
  noteFromPitch,
  noteName,
  nearestGuitarString,
  GUITAR_STRINGS,
} from "@/audio/pitch";

interface Reading {
  note: string;
  cents: number;
  freq: number;
  stringMidi: number;
}

type Status = "idle" | "listening" | "denied" | "error";

export default function TunerPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [reading, setReading] = useState<Reading | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setStatus("idle");
    setReading(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false },
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      setStatus("listening");

      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, ctx.sampleRate);
        if (freq > 0) {
          const midi = noteFromPitch(freq);
          setReading({
            note: noteName(midi),
            cents: centsOff(freq, midi),
            freq,
            stringMidi: nearestGuitarString(freq).midi,
          });
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const denied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "SecurityError");
      setStatus(denied ? "denied" : "error");
    }
  };

  const cents = reading?.cents ?? 0;
  const inTune = reading != null && Math.abs(cents) <= 5;
  // Needle position across a −50…+50 cents scale.
  const needlePct = Math.max(0, Math.min(100, ((cents + 50) / 100) * 100));

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Tuner</h1>
      <p className="mt-1.5 text-[13.5px] text-muted">
        Play one string at a time. The needle centers and turns green when you&apos;re in tune.
      </p>

      <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#121524] to-[#0e111c] px-4 py-7 text-center">
        {status !== "listening" ? (
          <div className="py-6">
            {status === "denied" && (
              <p className="mb-4 text-[13.5px] leading-relaxed text-pink">
                Mic access was blocked. Allow microphone access for this site in your browser, then
                try again.
              </p>
            )}
            {status === "error" && (
              <p className="mb-4 text-[13.5px] leading-relaxed text-pink">
                Couldn&apos;t start the mic. Check that a microphone is connected and try again.
              </p>
            )}
            <div className="font-display text-[54px] leading-none">🎤</div>
            <p className="mx-auto mt-4 max-w-[36ch] text-[13px] leading-relaxed text-faint">
              The tuner listens through your mic. Nothing is recorded or sent anywhere — it all stays
              on your device.
            </p>
            <button
              onClick={start}
              className="mt-5 w-full rounded-[14px] bg-accent py-3 text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Start tuner
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-[0.12em] text-faint">
              {reading ? "detected" : "listening…"}
            </div>
            <div
              className={`font-display text-[72px] font-bold leading-none transition-colors ${
                inTune ? "text-go" : "text-white"
              }`}
            >
              {reading ? reading.note : "—"}
            </div>
            <div className="mt-1 h-5 text-[13px] font-semibold">
              {reading ? (
                inTune ? (
                  <span className="text-go">In tune ✓</span>
                ) : (
                  <span className="text-beat">
                    {cents > 0 ? `${cents}¢ sharp — tune down` : `${Math.abs(cents)}¢ flat — tune up`}
                  </span>
                )
              ) : (
                <span className="text-faint">Pluck a string…</span>
              )}
            </div>

            {/* cents meter */}
            <div className="relative mx-auto mt-5 h-2 w-full max-w-[320px] rounded-full bg-[#262c40]">
              <div className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-faint" />
              <div
                className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-100 ${
                  inTune ? "bg-go" : "bg-accent-2"
                }`}
                style={{ left: `${needlePct}%` }}
              />
            </div>
            <div className="mx-auto mt-1.5 flex w-full max-w-[320px] justify-between text-[10px] text-faint">
              <span>♭ flat</span>
              <span>{reading ? `${reading.freq.toFixed(1)} Hz` : ""}</span>
              <span>sharp ♯</span>
            </div>

            {/* which string */}
            <div className="mt-6 flex justify-center gap-2">
              {GUITAR_STRINGS.map((s, i) => {
                const on = reading?.stringMidi === s.midi;
                return (
                  <span
                    key={i}
                    className={`grid h-9 w-9 place-items-center rounded-full border font-display text-[14px] font-bold transition ${
                      on
                        ? inTune
                          ? "border-go bg-go text-[#06231a]"
                          : "border-accent-2 bg-accent text-white"
                        : "border-line bg-panel text-muted"
                    }`}
                    title={s.octave}
                  >
                    {s.label}
                  </span>
                );
              })}
            </div>

            <button
              onClick={stop}
              className="mt-6 w-full rounded-[13px] border border-line bg-panel py-3 text-[14px] font-semibold text-muted transition hover:text-fg"
            >
              Stop
            </button>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-faint">
        Standard tuning, low to high: E · A · D · G · B · E.{" "}
        <Link href="/about" className="font-semibold text-accent-2 hover:underline">
          How to use Onbeat
        </Link>
      </p>
    </>
  );
}
