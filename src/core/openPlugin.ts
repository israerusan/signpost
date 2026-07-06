import type { App } from "obsidian";
import type { PluginRef } from "../types";

/**
 * Open a plugin's install page. Obsidian registers the `obsidian://show-plugin`
 * URI, which opens the community browser directly on that plugin (with an Install
 * button) — as close to one-click as the public surface allows. Signpost never
 * installs on the user's behalf; it only takes them to the page.
 */
export function openInstallPage(ref: PluginRef): void {
  window.open(`obsidian://show-plugin?id=${encodeURIComponent(ref.id)}`);
}

/** Open the plugin's source on GitHub — the honest fallback / "read more". */
export function openRepo(ref: PluginRef): void {
  window.open(`https://github.com/${ref.repo}`);
}

/**
 * Open the community-plugins browser generally (not tied to one plugin). Uses the
 * settings API, which is internal but stable and used across the ecosystem.
 */
export function openCommunityBrowser(app: App): void {
  const setting = (app as unknown as {
    setting?: { open?: () => void; openTabById?: (id: string) => void };
  }).setting;
  setting?.open?.();
  setting?.openTabById?.("community-plugins");
}
