"use client";

import { supabase } from "./supabase";
import { useProgress, exportProgress, type ProgressData } from "@/state/progress";

const TABLE = "progress";

/** Push the current local progress up to the user's row (insert or update). */
export async function pushProgress(userId: string): Promise<void> {
  if (!supabase) return;
  const data = exportProgress(useProgress.getState());
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
  if (error) console.warn("[sync] push failed:", error.message);
}

/**
 * On sign-in: pull the remote row, merge it into local, then push the merged
 * result back up so every device converges on the same state. If there's no
 * remote row yet, this just seeds it from local.
 */
export async function pullMergePush(userId: string): Promise<void> {
  if (!supabase) return;
  const { data: row, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[sync] pull failed:", error.message);
    return;
  }
  if (row?.data) {
    useProgress.getState().mergeRemote(row.data as Partial<ProgressData>);
  }
  await pushProgress(userId);
}
