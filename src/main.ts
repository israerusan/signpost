import { Plugin, WorkspaceLeaf } from "obsidian";
import type { SignpostSettings } from "./types";
import { DEFAULT_SETTINGS, sanitizeSettings } from "./core/settings";
import { SignpostSettingTab } from "./settings";
import { SignpostView, VIEW_TYPE_SIGNPOST } from "./ui/SignpostView";

export default class SignpostPlugin extends Plugin {
  settings: SignpostSettings = structuredClone(DEFAULT_SETTINGS);

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_SIGNPOST, (leaf) => new SignpostView(leaf, this));

    this.addRibbonIcon("signpost", "Open Signpost", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open",
      name: "Open the route map",
      callback: () => void this.activateView(),
    });

    this.addSettingTab(new SignpostSettingTab(this.app, this));

    // Re-read install state whenever the user returns to the view, so a plugin they
    // just installed flips to "Enabled" without a manual refresh.
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf?.view instanceof SignpostView) leaf.view.refreshAndRender();
      })
    );
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_SIGNPOST);
    if (existing.length > 0) {
      await workspace.revealLeaf(existing[0]);
      return;
    }
    // getRightLeaf can return null; fall back to a normal leaf so the ribbon/command
    // never silently does nothing (notably on mobile's drawer layout).
    const leaf: WorkspaceLeaf = workspace.getRightLeaf(false) ?? workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_TYPE_SIGNPOST, active: true });
    await workspace.revealLeaf(leaf);
  }

  /**
   * Repaint any open route-map views after a settings change. Uses forceRefresh,
   * not refreshAndRender: settings toggles change display-only state that the
   * install snapshot can't see, so the snapshot gate would otherwise skip them.
   */
  refreshOpenViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_SIGNPOST)) {
      if (leaf.view instanceof SignpostView) leaf.view.forceRefresh();
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = sanitizeSettings(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
