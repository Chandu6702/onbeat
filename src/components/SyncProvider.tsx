"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { pullMergePush, pushProgress } from "@/lib/progressSync";
import { useProgress } from "@/state/progress";

const PUSH_DEBOUNCE_MS = 2000;

// Mounts the cloud-sync lifecycle: watches auth, merges remote progress in on
// sign-in, and debounces local changes back up while signed in. Renders nothing.
// A no-op when Supabase isn't configured (supabase === null).
export default function SyncProvider() {
  const userId = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supabase) return;

    // Pick up an existing session on load.
    supabase.auth.getSession().then(({ data }) => {
      const id = data.session?.user.id ?? null;
      userId.current = id;
      if (id) void pullMergePush(id);
    });

    // React to sign-in / sign-out.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const id = session?.user.id ?? null;
      userId.current = id;
      if (event === "SIGNED_IN" && id) void pullMergePush(id);
    });

    // Debounced push of local changes while signed in.
    const unsub = useProgress.subscribe(() => {
      if (!userId.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (userId.current) void pushProgress(userId.current);
      }, PUSH_DEBOUNCE_MS);
    });

    return () => {
      sub.subscription.unsubscribe();
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return null;
}
