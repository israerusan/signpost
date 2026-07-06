# Signpost

**Not sure which of the 2,000+ community plugins you actually need? Start with the problem, not the plugin.**

Signpost is a free, offline route map for Obsidian's community plugins. Instead of a searchable list of names, it asks *what are you trying to do?* — daily journaling, task tracking, long-form writing, research, making things look nice — and points you at the small set of plugins that solve it, in a sensible order.

Its whole philosophy is **install less**. Beginners over-install, then wonder why their vault is slow and confusing. Signpost leads with the true essentials, marks everything else as "add later, if the pain appears," and flags overlapping picks so you don't run two tools that do the same job.

## What it does

- **Problem-first route map.** Curated "loadouts" grouped by goal, each with a plain-language problem statement and the why-these-in-this-order.
- **Knows what you already have.** Reads your installed/enabled plugins and marks each recommendation ✅ Enabled, ⚠️ Installed, or ○ Not installed. Toggle "hide what I already have" to see only the gaps — something no blog post or YouTube list can do.
- **Near one-click.** Every pick has an **Open install page** button that deep-links straight to that plugin in Obsidian's community browser (via the `obsidian://show-plugin` URI), plus a **GitHub** link to read more.
- **Anti-bloat by design.** Each loadout ends with a nudge about what *not* to install yet.

Signpost never installs, enables, or changes anything for you — it only takes you to the page.

## Zero maintenance

The route map is **bundled**, not fetched from a server. That means it works fully offline, has no tracking, and never breaks because a remote index went down. The picks are deliberately the load-bearing, long-maintained plugins that don't churn, so the list stays correct for a long time. Updates ship with plugin releases.

## Usage

1. Click the **signpost** ribbon icon, or run **Signpost: open the route map** from the command palette.
2. A panel opens in the right sidebar. Expand the problem that matches what you're trying to do.
3. Read the loadout, check what you're missing, and click **Open install page** on anything you want.

## Development

```bash
npm install
npm run dev      # watch build -> main.js
npm run build    # typecheck + production bundle
npm test         # lint (Obsidian review ruleset) + catalog & manifest contract tests
```

To try it in a vault, copy `main.js`, `manifest.json`, and `styles.css` into
`<vault>/.obsidian/plugins/signpost/` and enable it in **Settings → Community plugins**.

### Editing the route map

All content lives in [`src/data/catalog.ts`](src/data/catalog.ts) as plain data — categories → loadouts → plugin picks. `npm test` validates that every pick has a real-looking id, a `owner/repo` GitHub slug, and that each loadout marks at least one "start here" essential.

## License

MIT — made for love, for the Obsidian community.
