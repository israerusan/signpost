import type { SignpostSettings } from "../types";

/** Baseline settings, applied on first run and as the fallback for missing keys. */
export const DEFAULT_SETTINGS: SignpostSettings = {
  version: 1,
  collapsedCategories: [],
  hideInstalled: false,
};

/**
 * Coerce persisted data (which may be corrupt, hand-edited, synced with a
 * conflict, or from a future/older schema) into a valid settings object. Never
 * trust the shape of what loadData() returns: a non-array `collapsedCategories`
 * would otherwise crash the view on its first render. Pure and side-effect free
 * so it can be unit-tested without the Obsidian runtime.
 */
export function sanitizeSettings(data: unknown): SignpostSettings {
  const raw = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const collapsedCategories = Array.isArray(raw.collapsedCategories)
    ? raw.collapsedCategories.filter((x): x is string => typeof x === "string")
    : [];
  return {
    version: typeof raw.version === "number" ? raw.version : DEFAULT_SETTINGS.version,
    collapsedCategories,
    hideInstalled: raw.hideInstalled === true,
  };
}
