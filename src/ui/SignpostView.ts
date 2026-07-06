import { ItemView, WorkspaceLeaf, setIcon } from "obsidian";
import type SignpostPlugin from "../main";
import type { Category, Loadout, PluginRef, InstallState } from "../types";
import { CATALOG } from "../data/catalog";
import { readInstalled, stateFor, type InstalledSnapshot } from "../core/installed";
import { openInstallPage, openRepo, openCommunityBrowser } from "../core/openPlugin";
import { PRODUCT_NAME, TAGLINE, PHILOSOPHY } from "../product";

export const VIEW_TYPE_SIGNPOST = "signpost-view";

const STATE_LABEL: Record<InstallState, string> = {
  enabled: "Enabled",
  installed: "Installed",
  missing: "Not installed",
};

function sameSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function sameSnapshot(a: InstalledSnapshot, b: InstalledSnapshot): boolean {
  return sameSet(a.enabled, b.enabled) && sameSet(a.installed, b.installed);
}

export class SignpostView extends ItemView {
  private snapshot: InstalledSnapshot;
  private rendered = false;

  constructor(leaf: WorkspaceLeaf, private plugin: SignpostPlugin) {
    super(leaf);
    this.snapshot = readInstalled(this.app);
  }

  getViewType(): string {
    return VIEW_TYPE_SIGNPOST;
  }

  getDisplayText(): string {
    return PRODUCT_NAME;
  }

  getIcon(): string {
    return "signpost";
  }

  async onOpen(): Promise<void> {
    this.refreshAndRender();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
    // Keep `rendered` honest: contentEl no longer holds a render, so a reused
    // instance (deferred views) must rebuild on the next open even if the install
    // snapshot is unchanged — otherwise the snapshot gate would leave it blank.
    this.rendered = false;
  }

  /**
   * Re-read install state and repaint only if something we display actually
   * changed. `active-leaf-change` fires this whenever the view merely regains
   * focus, and a full rebuild there would reset the user's scroll position for
   * nothing — so bail out when the snapshot is identical.
   */
  refreshAndRender(): void {
    const next = readInstalled(this.app);
    if (this.rendered && sameSnapshot(this.snapshot, next)) return;
    this.snapshot = next;
    this.render();
  }

  /**
   * Unconditional repaint, for changes the install snapshot can't detect —
   * settings-tab toggles (hide-installed, expand-all) mutate display-only state,
   * so they must bypass the snapshot gate that `refreshAndRender` applies.
   */
  forceRefresh(): void {
    this.snapshot = readInstalled(this.app);
    this.render();
  }

  private render(): void {
    const root = this.contentEl;
    // Preserve scroll across the rebuild so a repaint (filter toggle, real install
    // change) doesn't jump the user back to the top of the list.
    const prevScroll = root.scrollTop;
    root.empty();
    root.addClass("signpost-view");

    this.renderHeader(root);

    for (const category of CATALOG) {
      this.renderCategory(root, category);
    }

    root.createEl("p", {
      cls: "signpost-footer",
      text: "Signpost only ever links you to a plugin's page — it never installs or enables anything for you.",
    });

    root.scrollTop = prevScroll;
    this.rendered = true;
  }

  private renderHeader(root: HTMLElement): void {
    const header = root.createDiv({ cls: "signpost-header" });
    header.createEl("h2", { text: PRODUCT_NAME, cls: "signpost-title" });
    header.createEl("p", { text: TAGLINE, cls: "signpost-tagline" });

    const creed = header.createDiv({ cls: "signpost-creed" });
    setIcon(creed.createSpan({ cls: "signpost-creed-icon" }), "leaf");
    creed.createSpan({ text: PHILOSOPHY });

    const bar = header.createDiv({ cls: "signpost-toolbar" });

    const browseBtn = bar.createEl("button", { cls: "signpost-btn", text: "Browse all community add-ons" });
    browseBtn.addEventListener("click", () => openCommunityBrowser(this.app));

    const refreshBtn = bar.createEl("button", { cls: "signpost-btn signpost-btn-ghost", text: "Refresh status" });
    refreshBtn.addEventListener("click", () => this.refreshAndRender());

    // A <label> wrapping the checkbox: clicking the text toggles it and assistive
    // tech announces the text as the control's name (no id/for wiring needed).
    const toggle = bar.createEl("label", { cls: "signpost-toggle" });
    const cb = toggle.createEl("input", { type: "checkbox" });
    cb.checked = this.plugin.settings.hideInstalled;
    cb.addEventListener("change", () => {
      this.plugin.settings.hideInstalled = cb.checked;
      void this.plugin.saveSettings();
      this.render();
    });
    toggle.createSpan({ text: "Hide what I've already enabled" });
  }

  private renderCategory(root: HTMLElement, category: Category): void {
    const collapsed = this.plugin.settings.collapsedCategories.includes(category.id);
    const section = root.createDiv({ cls: "signpost-category" });

    const head = section.createDiv({ cls: "signpost-category-head" });
    // Not a real <button> (it wraps heading/paragraph block content); give it the
    // button role, focusability, and keyboard activation so it isn't mouse-only.
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.setAttribute("aria-expanded", String(!collapsed));
    const chevron = head.createSpan({ cls: "signpost-chevron" });
    setIcon(chevron, collapsed ? "chevron-right" : "chevron-down");
    setIcon(head.createSpan({ cls: "signpost-category-icon" }), category.icon);
    const titles = head.createDiv({ cls: "signpost-category-titles" });
    titles.createEl("h3", { text: category.title });
    titles.createEl("p", { text: category.blurb, cls: "signpost-category-blurb" });

    const body = section.createDiv({ cls: "signpost-category-body" });
    if (collapsed) body.addClass("is-collapsed");

    head.addEventListener("click", () => void this.toggleCategory(category.id, head, body, chevron));
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.toggleCategory(category.id, head, body, chevron);
      }
    });

    for (const loadout of category.loadouts) {
      this.renderLoadout(body, loadout);
    }
  }

  private async toggleCategory(
    id: string,
    head: HTMLElement,
    body: HTMLElement,
    chevron: HTMLElement
  ): Promise<void> {
    const list = this.plugin.settings.collapsedCategories;
    const idx = list.indexOf(id);
    const nowCollapsed = idx === -1;
    if (nowCollapsed) list.push(id);
    else list.splice(idx, 1);
    body.toggleClass("is-collapsed", nowCollapsed);
    head.setAttribute("aria-expanded", String(!nowCollapsed));
    setIcon(chevron, nowCollapsed ? "chevron-right" : "chevron-down");
    await this.plugin.saveSettings();
  }

  private renderLoadout(body: HTMLElement, loadout: Loadout): void {
    const card = body.createDiv({ cls: "signpost-loadout" });

    const q = card.createDiv({ cls: "signpost-problem" });
    setIcon(q.createSpan({ cls: "signpost-problem-icon" }), "help-circle");
    q.createSpan({ text: loadout.problem });

    card.createEl("p", { text: loadout.summary, cls: "signpost-summary" });

    const visible = loadout.plugins.filter(
      (p) => !(this.plugin.settings.hideInstalled && stateFor(p.id, this.snapshot) === "enabled")
    );

    if (visible.length === 0) {
      card.createEl("p", {
        cls: "signpost-allset",
        text: "You already have everything here. Nice — nothing to add.",
      });
    } else {
      const list = card.createDiv({ cls: "signpost-plugins" });
      for (const ref of visible) this.renderPlugin(list, ref);
    }

    if (loadout.tip) {
      const tip = card.createDiv({ cls: "signpost-tip" });
      setIcon(tip.createSpan({ cls: "signpost-tip-icon" }), "lightbulb");
      tip.createSpan({ text: loadout.tip });
    }
  }

  private renderPlugin(list: HTMLElement, ref: PluginRef): void {
    const state = stateFor(ref.id, this.snapshot);
    const row = list.createDiv({ cls: `signpost-plugin is-${state}` });
    if (ref.core) row.addClass("is-core");

    const status = row.createDiv({ cls: "signpost-status" });
    const dot = status.createSpan({ cls: `signpost-dot is-${state}` });
    setIcon(dot, state === "missing" ? "circle" : "check");

    const main = row.createDiv({ cls: "signpost-plugin-main" });
    const nameRow = main.createDiv({ cls: "signpost-name-row" });
    nameRow.createSpan({ text: ref.name, cls: "signpost-name" });
    if (ref.core) nameRow.createSpan({ text: "start here", cls: "signpost-badge" });
    nameRow.createSpan({ text: STATE_LABEL[state], cls: `signpost-state-label is-${state}` });

    main.createDiv({ text: ref.role, cls: "signpost-role" });
    if (ref.note) {
      const note = main.createDiv({ cls: "signpost-note" });
      setIcon(note.createSpan({ cls: "signpost-note-icon" }), "info");
      note.createSpan({ text: ref.note });
    }

    const actions = main.createDiv({ cls: "signpost-actions" });
    if (state === "missing") {
      const install = actions.createEl("button", { cls: "signpost-btn signpost-btn-primary", text: "Open install page" });
      install.addEventListener("click", () => openInstallPage(this.app, ref));
    } else {
      const view = actions.createEl("button", { cls: "signpost-btn signpost-btn-ghost", text: "View in directory" });
      view.addEventListener("click", () => openInstallPage(this.app, ref));
    }
    const repo = actions.createEl("button", { cls: "signpost-btn signpost-btn-link", text: "GitHub" });
    repo.addEventListener("click", () => openRepo(ref));
  }
}
