import { App, PluginSettingTab, Setting } from "obsidian";
import type SignpostPlugin from "./main";
import { openCommunityBrowser } from "./core/openPlugin";

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

    new Setting(containerEl).setName("Feedback").setHeading();

    new Setting(containerEl)
      .setName("Bugs and feature requests")
      .setDesc("Issues and ideas are tracked on GitHub. Opens in your browser.")
      .addButton((b) =>
        b.setButtonText("Report a bug").onClick(() => {
          window.open("https://github.com/israerusan/signpost/issues/new?labels=bug");
        })
      )
      .addButton((b) =>
        b.setButtonText("Request a feature").onClick(() => {
          window.open("https://github.com/israerusan/signpost/issues/new?labels=enhancement");
        })
      );
  }
}
