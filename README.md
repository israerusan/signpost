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

## Installation

**From the community directory** (once listed): Settings → Community plugins → Browse → search "Signpost" → Install → Enable.

**Manually, from a release:** download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/israerusan/signpost/releases/latest) into `<your vault>/.obsidian/plugins/signpost/`, then enable it under Settings → Community plugins.

**Via [BRAT](https://github.com/TfTHacker/obsidian42-brat)** (for beta testers): add the beta plugin `israerusan/signpost`.

## Usage

1. Click the **signpost** ribbon icon, or run **Signpost: Open the route map** from the command palette.
2. A panel opens in the right sidebar. Expand the problem that matches what you're trying to do.
3. Read the loadout, check what you're missing, and click **Open install page** on anything you want.

## Feedback and support

Bug reports, feature requests, and questions all go to the GitHub issue tracker. It is
the only place I track them, so an issue will always get further than a review comment.

- **[Report a bug](https://github.com/israerusan/signpost/issues/new?labels=bug)** — please include your Obsidian version, your operating system, and the steps that reproduce it.
- **[Request a feature](https://github.com/israerusan/signpost/issues/new?labels=enhancement)** — describe the workflow you are trying to make faster; that is more useful than a proposed solution.
- **[Browse open issues](https://github.com/israerusan/signpost/issues)** — worth a look first, in case it is already tracked.

## More plugins by the same author

Small, local-first Obsidian plugins that each do one job and keep your data in your vault.
All of them are in the community directory — search the name under
**Settings → Community plugins**.

**Search and views**

- [Vault Spotlight](https://github.com/israerusan/obsidian-vault-spotlight) — keyboard-first command center — fuzzy search, saved workflows, and result actions.
- [Bases Power Pack](https://github.com/israerusan/bases-power-pack) — kanban, calendar, Gantt, and outline views over your notes or a `.base` file.

**Vault health**

- [Vault Triage](https://github.com/israerusan/vault-triage) — find stale, orphaned, unfinished, and metadata-broken notes, then work through them.
- [Attachment Audit](https://github.com/israerusan/attachment-audit) — find orphaned, duplicate, oversized, and misplaced attachments, then clean them up safely.
- [Patina](https://github.com/israerusan/patina) — score every note's staleness from edits, opens, and inbound links.
- [Vault Router](https://github.com/israerusan/vault-router) — move new notes out of Inbox with fast local routing rules.
- [FlowKit Health Dashboard](https://github.com/israerusan/flowkit-health-dashboard) — find which add-on is breaking your vault, and score every one installed.

**Writing and research**

- [Prose Lens](https://github.com/israerusan/prose-lens) — live writing feedback — passive voice, adverbs, hedges, cliches, and a reading grade.
- [Prior Art](https://github.com/israerusan/prior-art) — show similar existing notes while you write, and merge duplicates without losing links.
- [Standing Questions](https://github.com/israerusan/standing-questions) — track the open questions in your vault and surface new notes that may answer them.
- [Unwritten](https://github.com/israerusan/unwritten) — report the notes you never wrote — unexplained link pairs, stub hubs, unreasoned decisions.
- [Effort Index](https://github.com/israerusan/effort-index) — measure the editing time behind every note and resurface the expensive ones.

**Time and billing**

- [Task Calendar Bridge](https://github.com/israerusan/obsidian-task-calendar-bridge) — export dated Markdown tasks to standards-based ICS calendar files.
- [Invoice Forge](https://github.com/israerusan/obsidian-invoice-forge) — turn `#billable` notes into numbered invoices, so nothing is missed or billed twice.
- [Time Tracker and Invoicing](https://github.com/israerusan/time-tracker-invoicing) — track billable time against notes and projects, then invoice by client.

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
