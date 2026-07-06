import { Platform } from "obsidian";
import type { App } from "obsidian";
import type { PluginRef } from "../types";

/**
 * Open a plugin's install page. On desktop, the `obsidian://show-plugin` URI opens
 * the community browser directly on that plugin (with an Install button) — as close
 * to one-click as the public surface allows. That URI relies on the OS round-tripping
 * the obsidian:// scheme back into the app, which is unreliable inside the mobile
 * webview and often no-ops — so on mobile we fall back to the in-app community
 * browser (which does work on phones) rather than leave a dead button. Signpost never
 * installs on the user's behalf; it only takes them to the page.
 */
export function openInstallPage(app: App, ref: PluginRef): void {
  if (Platform.isDesktopApp) {
    window.open(`obsidian://show-plugin?id=${encodeURIComponent(ref.id)}`);
  } else {
    openCommunityBrowser(app);
  }
}

/** Open the plugin's source on GitHub — the honest fallback / "read more". */
export function openRepo(ref: PluginRef): void {
  window.open(`https://github.com/${ref.repo}`, "_blank", "noopener");
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
