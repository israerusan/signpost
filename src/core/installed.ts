import type { App } from "obsidian";
import type { InstallState } from "../types";

/**
 * Obsidian's plugin manager is not in the public typings, but it is stable and
 * widely used by community plugins. We read two things from it:
 *   - `manifests`      — every INSTALLED community plugin (id -> manifest)
 *   - `enabledPlugins` — the ids currently toggled ON
 * Everything is read-only; Signpost never enables or installs anything itself.
 */
interface PluginsApi {
  manifests?: Record<string, unknown>;
  enabledPlugins?: Set<string>;
}

function getPluginsApi(app: App): PluginsApi | undefined {
  return (app as unknown as { plugins?: PluginsApi }).plugins;
}

/** Snapshot of which recommended ids the user already has. */
export interface InstalledSnapshot {
  installed: Set<string>;
  enabled: Set<string>;
}

export function readInstalled(app: App): InstalledSnapshot {
  const api = getPluginsApi(app);
  const installed = new Set<string>(api?.manifests ? Object.keys(api.manifests) : []);
  const enabled = new Set<string>(api?.enabledPlugins ? Array.from(api.enabledPlugins) : []);
  // A plugin can be enabled without appearing in `manifests` during load races;
  // treat enabled as implying installed so the UI never contradicts itself.
  for (const id of enabled) installed.add(id);
  return { installed, enabled };
}

export function stateFor(id: string, snap: InstalledSnapshot): InstallState {
  if (snap.enabled.has(id)) return "enabled";
  if (snap.installed.has(id)) return "installed";
  return "missing";
}
