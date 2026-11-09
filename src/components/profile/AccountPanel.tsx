"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AccountPanel() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserEmail(session?.user.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // When sync isn't set up, show nothing — the app stays fully local.
  if (!isSupabaseConfigured || !supabase) return null;
  const sb = supabase; // non-null within this render

  const sendLink = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/profile" : undefined },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  const signOut = async () => {
    await sb.auth.signOut();
    setUserEmail(null);
    setSent(false);
    setEmail("");
  };

  return (
    <div className="mt-3 rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">☁️</span>
        <h2 className="font-display text-[15px] font-semibold">Cloud sync</h2>
        {userEmail && (
          <span className="ml-auto rounded-full bg-go/15 px-2 py-0.5 text-[11px] font-bold uppercase text-go">
            Synced
          </span>
        )}
      </div>

      {userEmail ? (
        <div className="mt-2">
          <p className="text-[12.5px] text-muted">
            Signed in as <span className="text-fg">{userEmail}</span>. Your progress follows you
            across devices.
          </p>
          <button
            onClick={signOut}
            className="mt-3 rounded-[11px] border border-line bg-panel-2 px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-fg"
          >
            Sign out
          </button>
        </div>
      ) : sent ? (
        <p className="mt-2 text-[12.5px] leading-relaxed text-go">
          Check your email for a sign-in link. Open it on this device to finish.
        </p>
      ) : (
        <div className="mt-2">
          <p className="text-[12.5px] leading-relaxed text-muted">
            Sign in to back up your progress and sync it across devices. Optional — the app works
            fully without it.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="flex-1 rounded-[11px] border border-line bg-panel-2 px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-accent"
            />
            <button
              onClick={sendLink}
              disabled={busy}
              className="rounded-[11px] bg-accent px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send magic link"}
            </button>
          </div>
          {error && <p className="mt-2 text-[12.5px] font-medium text-pink">{error}</p>}
        </div>
      )}
    </div>
  );
}
