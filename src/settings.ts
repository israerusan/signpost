import { App, PluginSettingTab, Setting } from "obsidian";
import type SignpostPlugin from "./main";
import type { SignpostSettings } from "./types";
import { openCommunityBrowser } from "./core/openPlugin";

export const DEFAULT_SETTINGS: SignpostSettings = {
  version: 1,
  collapsedCategories: [],
  hideInstalled: false,
};

export class SignpostSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: SignpostPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Hide add-ons I already have")
      .setDesc("In the route map, skip plugins you already have enabled so you only see the gaps.")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.hideInstalled).onChange(async (v) => {
          this.plugin.settings.hideInstalled = v;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        })
      );

    new Setting(containerEl)
      .setName("Expand every section")
      .setDesc("Reset any sections you've collapsed in the route map.")
      .addButton((b) =>
        b.setButtonText("Expand all").onClick(async () => {
          this.plugin.settings.collapsedCategories = [];
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        })
      );

    new Setting(containerEl)
      .setName("Browse the full directory")
      .setDesc("Open the built-in community add-ons browser to search everything.")
      .addButton((b) =>
        b.setButtonText("Open browser").onClick(() => openCommunityBrowser(this.app))
      );
  }
}
