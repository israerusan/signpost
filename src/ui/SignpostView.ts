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

  /** Re-focus a control by selector after a rebuild so keyboard focus survives. */
  private focusAfterRender(selector: string): void {
    this.contentEl.querySelector<HTMLElement>(selector)?.focus();
  }

  /** A purely decorative icon, hidden from screen readers so it isn't read as noise. */
  private decorIcon(parent: HTMLElement, cls: string, icon: string): void {
    const el = parent.createSpan({ cls });
    el.setAttribute("aria-hidden", "true");
    setIcon(el, icon);
  }

  private renderHeader(root: HTMLElement): void {
    const header = root.createDiv({ cls: "signpost-header" });
    header.createEl("h2", { text: PRODUCT_NAME, cls: "signpost-title" });
    header.createEl("p", { text: TAGLINE, cls: "signpost-tagline" });

    const creed = header.createDiv({ cls: "signpost-creed" });
    const creedIcon = creed.createSpan({ cls: "signpost-creed-icon" });
    creedIcon.setAttribute("aria-hidden", "true");
    setIcon(creedIcon, "leaf");
    creed.createSpan({ text: PHILOSOPHY });

    const bar = header.createDiv({ cls: "signpost-toolbar" });

    const browseBtn = bar.createEl("button", { cls: "signpost-btn", text: "Browse all community add-ons" });
    browseBtn.addEventListener("click", () => openCommunityBrowser(this.app));

    const refreshBtn = bar.createEl("button", { cls: "signpost-btn signpost-btn-ghost signpost-refresh", text: "Refresh status" });
    refreshBtn.addEventListener("click", () => {
      this.refreshAndRender();
      // If the repaint happened it destroyed this button; re-focus its replacement
      // so a keyboard user isn't dumped to the top of the view. Harmless no-op if
      // nothing was rebuilt (same node still focused).
      this.focusAfterRender(".signpost-refresh");
    });

    // A <label> wrapping the checkbox: clicking the text toggles it and assistive
    // tech announces the text as the control's name (no id/for wiring needed).
    const toggle = bar.createEl("label", { cls: "signpost-toggle" });
    const cb = toggle.createEl("input", { type: "checkbox" });
    cb.checked = this.plugin.settings.hideInstalled;
    cb.addEventListener("change", () => {
      this.plugin.settings.hideInstalled = cb.checked;
      void this.plugin.saveSettings();
      this.render();
      this.focusAfterRender(".signpost-toggle input");
    });
    toggle.createSpan({ text: "Hide what I've already enabled" });
  }

  private renderCategory(root: HTMLElement, category: Category): void {
    const collapsed = this.plugin.settings.collapsedCategories.includes(category.id);
    const section = root.createDiv({ cls: "signpost-category" });

    const bodyId = `signpost-cat-${category.id}`;
    const head = section.createDiv({ cls: "signpost-category-head" });

    // A real <button> inside the <h3> is the accessible disclosure pattern: the
    // heading stays a heading (screen-reader heading navigation works), and the
    // button gets a native focus ring plus Enter/Space for free. Decorative icons
    // are hidden so the button's name is just the category title.
    const heading = head.createEl("h3", { cls: "signpost-category-title" });
    const btn = heading.createEl("button", { cls: "signpost-disclosure" });
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-controls", bodyId);
    const chevron = btn.createSpan({ cls: "signpost-chevron" });
    chevron.setAttribute("aria-hidden", "true");
    setIcon(chevron, collapsed ? "chevron-right" : "chevron-down");
    const catIcon = btn.createSpan({ cls: "signpost-category-icon" });
    catIcon.setAttribute("aria-hidden", "true");
    setIcon(catIcon, category.icon);
    btn.createSpan({ cls: "signpost-category-title-text", text: category.title });

    head.createEl("p", { text: category.blurb, cls: "signpost-category-blurb" });

    const body = section.createDiv({ cls: "signpost-category-body" });
    body.id = bodyId;
    if (collapsed) body.addClass("is-collapsed");

    btn.addEventListener("click", () => void this.toggleCategory(category.id, btn, body, chevron));

    for (const loadout of category.loadouts) {
      this.renderLoadout(body, loadout);
    }
  }

  private async toggleCategory(
    id: string,
    btn: HTMLElement,
    body: HTMLElement,
    chevron: HTMLElement
  ): Promise<void> {
    const list = this.plugin.settings.collapsedCategories;
    const idx = list.indexOf(id);
    const nowCollapsed = idx === -1;
    if (nowCollapsed) list.push(id);
    else list.splice(idx, 1);
    body.toggleClass("is-collapsed", nowCollapsed);
    btn.setAttribute("aria-expanded", String(!nowCollapsed));
    setIcon(chevron, nowCollapsed ? "chevron-right" : "chevron-down");
    await this.plugin.saveSettings();
  }

  private renderLoadout(body: HTMLElement, loadout: Loadout): void {
    const card = body.createDiv({ cls: "signpost-loadout" });

    const q = card.createDiv({ cls: "signpost-problem" });
    this.decorIcon(q, "signpost-problem-icon", "help-circle");
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
      this.decorIcon(tip, "signpost-tip-icon", "lightbulb");
      tip.createSpan({ text: loadout.tip });
    }
  }

  private renderPlugin(list: HTMLElement, ref: PluginRef): void {
    const state = stateFor(ref.id, this.snapshot);
    const row = list.createDiv({ cls: `signpost-plugin is-${state}` });
    if (ref.core) row.addClass("is-core");

    // The dot's meaning is fully carried by the adjacent text label, so hide it.
    const status = row.createDiv({ cls: "signpost-status" });
    const dot = status.createSpan({ cls: `signpost-dot is-${state}` });
    dot.setAttribute("aria-hidden", "true");
    setIcon(dot, state === "missing" ? "circle" : "check");

    const main = row.createDiv({ cls: "signpost-plugin-main" });
    const nameRow = main.createDiv({ cls: "signpost-name-row" });
    nameRow.createSpan({ text: ref.name, cls: "signpost-name" });
    if (ref.core) nameRow.createSpan({ text: "start here", cls: "signpost-badge" });
    nameRow.createSpan({ text: STATE_LABEL[state], cls: `signpost-state-label is-${state}` });

    main.createDiv({ text: ref.role, cls: "signpost-role" });
    if (ref.note) {
      const note = main.createDiv({ cls: "signpost-note" });
      this.decorIcon(note, "signpost-note-icon", "info");
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
