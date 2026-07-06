// Data model for the bundled route map. Everything is plain data so the catalog
// (src/data/catalog.ts) reads like a document and can be validated by a test.

/** A single recommended community plugin within a loadout. */
export interface PluginRef {
  /**
   * The community plugin id — the same id used in `.obsidian/plugins/<id>` and in
   * the `obsidian://show-plugin?id=<id>` URI. Used both to deep-link the install
   * page and to detect whether the user already has it.
   */
  id: string;
  /** Display name, as it appears in the community directory. */
  name: string;
  /** `owner/repo` on GitHub — the fallback link if the install URI can't resolve. */
  repo: string;
  /** One line: what it does and why it earns a slot here. */
  role: string;
  /**
   * Part of the minimal starter set for this loadout. The UI leads with these and
   * treats the rest as "add later, if the pain appears".
   */
  core?: boolean;
  /** Optional caveat: overlap with another pick, an advanced-only warning, etc. */
  note?: string;
}

/** A curated set of plugins that together solve one concrete problem. */
export interface Loadout {
  id: string;
  /** Short label for the section header, e.g. "Daily notes & journaling". */
  title: string;
  /** The problem in the user's own voice, e.g. "My daily notes are a mess". */
  problem: string;
  /** The approach in a sentence or two — the "why these, in this order". */
  summary: string;
  plugins: PluginRef[];
  /** One anti-bloat / sequencing nudge shown under the loadout. */
  tip?: string;
}

/** A top-level problem area, grouping related loadouts. */
export interface Category {
  id: string;
  title: string;
  /** A Lucide icon name (bundled with Obsidian) for the section header. */
  icon: string;
  /** One line framing the category. */
  blurb: string;
  loadouts: Loadout[];
}

/** Live install state for a plugin id, computed against the running app. */
export type InstallState = "enabled" | "installed" | "missing";

export interface SignpostSettings {
  version: number;
  /** Category ids the user has collapsed, so the view restores their layout. */
  collapsedCategories: string[];
  /** Hide plugins the user already has enabled, to focus on the gaps. */
  hideInstalled: boolean;
}
