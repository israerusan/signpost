import type { Category } from "../types";

/**
 * THE route map. This is the entire value of Signpost, and it is deliberately
 * bundled (not fetched) so the plugin has zero maintenance surface and works
 * fully offline. Curation bias, on purpose:
 *
 *   - Problem-first. Every entry answers "I'm trying to do X", never "here is a
 *     category of tools".
 *   - Lean. Each loadout names a small set and marks the true essentials `core`.
 *     The goal is to install LESS, not to catalog everything.
 *   - Stable picks. These are load-bearing, widely-used plugins that don't churn,
 *     so a bundled list stays correct for a long time. Where a pick has gone quiet
 *     (maintenance mode) or core Obsidian has since absorbed its job (e.g. Bases
 *     for dashboards, the 1.5 table editor), its `note` says so honestly rather
 *     than pretending it's the only way.
 *
 * `id` must be the real community plugin id (used for install-detection and the
 * `obsidian://show-plugin?id=` deep link). `repo` is the GitHub fallback link.
 */
export const CATALOG: Category[] = [
  {
    id: "start-here",
    title: "I'm brand new — where do I start?",
    icon: "compass",
    blurb: "The short answer: barely anything. Live in the app first, then add tools when you feel a specific pain.",
    loadouts: [
      {
        id: "essential-five",
        title: "The essential few",
        problem: "There are thousands of plugins and I don't know what I need.",
        summary:
          "Core Obsidian already does most of what beginners install plugins for (links, tags, search, canvas, graph). Resist the urge to install a big starter pack. These few smooth the rough edges without changing how the app works — add them one at a time, not all at once.",
        plugins: [
          {
            id: "table-editor-obsidian",
            name: "Advanced Tables",
            repo: "tgrosinger/advanced-tables-obsidian",
            role: "Adds what core's table editor doesn't: Tab navigation, sort-by-column, spreadsheet-style formulas, and CSV export.",
            note: "Obsidian 1.5+ edits tables natively, so add this only if you want the extras above.",
          },
          {
            id: "obsidian-outliner",
            name: "Outliner",
            repo: "vslinko/obsidian-outliner",
            role: "Bullet lists behave like a real outliner: move, indent, and fold branches with keyboard shortcuts.",
            core: true,
          },
          {
            id: "recent-files-obsidian",
            name: "Recent Files",
            repo: "tgrosinger/recent-files-obsidian",
            role: "A sidebar list of what you had open — the single most-missed feature for new users.",
            core: true,
          },
          {
            id: "obsidian-linter",
            name: "Linter",
            repo: "platers/obsidian-linter",
            role: "Quietly tidies frontmatter and formatting on save, so your notes stay consistent.",
            note: "Powerful — start with defaults and only turn on rules you understand.",
          },
        ],
        tip: "If you install nothing else for your first month, that's a feature. Pick a theme you like and just write.",
      },
    ],
  },
  {
    id: "daily-notes",
    title: "My daily notes & journaling are a mess",
    icon: "calendar-days",
    blurb: "A repeatable daily note with the right template beats a perfect system you never open.",
    loadouts: [
      {
        id: "journaling",
        title: "Daily notes & journaling",
        problem: "I want to open one note per day, pre-filled, and jump between days easily.",
        summary:
          "Calendar gives you a clickable month to hop between daily notes. Templater fills each new day with your template (tasks due, a prompt, yesterday's carry-over). Periodic Notes extends the same idea to weekly/monthly reviews once daily feels natural.",
        plugins: [
          {
            id: "calendar",
            name: "Calendar",
            repo: "liamcain/obsidian-calendar-plugin",
            role: "A month view in the sidebar; click any day to open or create its note.",
            core: true,
            note: "Ubiquitous and stable, but rarely updated now — fine to rely on, just don't expect new features.",
          },
          {
            id: "templater-obsidian",
            name: "Templater",
            repo: "SilentVoid13/Templater",
            role: "Dynamic templates — dates, prompts, and small scripts that run when a note is created.",
            core: true,
          },
          {
            id: "periodic-notes",
            name: "Periodic Notes",
            repo: "liamcain/obsidian-periodic-notes",
            role: "Adds weekly, monthly, and yearly notes with the same template treatment.",
            note: "Add once daily notes are a habit — not on day one. Maintenance has been quiet since 2022, but it still works; some users prefer a community fork.",
          },
          {
            id: "homepage",
            name: "Homepage",
            repo: "mirnovov/obsidian-homepage",
            role: "Opens today's note (or a dashboard) automatically when you launch Obsidian.",
          },
        ],
        tip: "Obsidian's built-in Daily Notes core plugin is enough to start. Add Calendar + Templater only when the manual steps annoy you.",
      },
    ],
  },
  {
    id: "tasks",
    title: "I want to track tasks & projects",
    icon: "list-checks",
    blurb: "Decide first: lightweight checkboxes scattered in notes, or a real query-driven system?",
    loadouts: [
      {
        id: "task-management",
        title: "Tasks & project tracking",
        problem: "My to-dos are buried across dozens of notes and I can't see what's due.",
        summary:
          "Tasks lets you write a checkbox anywhere with a due date, then query all of them into one list ('everything due this week'). For broader dashboards that gather notes, turn on Obsidian's built-in Bases core plugin first — it's native and GUI-driven, no query language needed. Reach for Dataview only when you outgrow that. Kanban is optional, for people who think in boards.",
        plugins: [
          {
            id: "obsidian-tasks-plugin",
            name: "Tasks",
            repo: "obsidian-tasks-group/obsidian-tasks",
            role: "Due dates, recurrence, and priorities on checkboxes, plus queries that gather them anywhere.",
            core: true,
          },
          {
            id: "dataview",
            name: "Dataview",
            repo: "blacksmithgu/obsidian-dataview",
            role: "Turns your notes into a queryable database (DQL) — powers custom indexes and reading logs.",
            note: "Try the core Bases plugin first; it now covers most dashboards with a GUI. Add Dataview when you need DQL's flexibility — but note it's in maintenance mode (last release 2025).",
          },
          {
            id: "obsidian-kanban",
            name: "Kanban",
            repo: "obsidian-community/obsidian-kanban",
            role: "Trello-style boards stored as plain Markdown, good for project stages.",
          },
          {
            id: "quickadd",
            name: "QuickAdd",
            repo: "chhoumann/quickadd",
            role: "One shortcut to capture a task or note from anywhere, without breaking flow.",
          },
        ],
        tip: "Tasks and Kanban overlap — most people want one primary system. Try Tasks first; reach for Kanban only if you genuinely think in columns.",
      },
    ],
  },
  {
    id: "writing",
    title: "I'm writing something long (a book, thesis, docs)",
    icon: "book-open",
    blurb: "Long-form needs structure and clean export more than it needs more note-taking gadgets.",
    loadouts: [
      {
        id: "longform-writing",
        title: "Long-form & manuscripts",
        problem: "I'm drafting a book or thesis and my chapters are scattered fragments.",
        summary:
          "Longform stitches many small scene/section notes into one manuscript with drag-to-reorder. Outliner keeps your structure sane while drafting. When it's time to hand something in, Enhancing Export turns your Markdown into Word/PDF/LaTeX via Pandoc.",
        plugins: [
          {
            id: "longform",
            name: "Longform",
            repo: "kevboh/longform",
            role: "Compile many notes into a single ordered manuscript; track word-count goals.",
            core: true,
          },
          {
            id: "obsidian-outliner",
            name: "Outliner",
            repo: "vslinko/obsidian-outliner",
            role: "Move and fold sections cleanly while you shape the draft.",
            core: true,
          },
          {
            id: "obsidian-enhancing-export",
            name: "Enhancing Export",
            repo: "mokeyish/obsidian-enhancing-export",
            role: "Export to Word, PDF, LaTeX, and more via Pandoc — for the version you actually submit.",
            note: "Needs Pandoc installed on your computer; desktop only.",
          },
        ],
        tip: "Don't chase the perfect writing environment. One structure plugin + one export path is the whole toolkit.",
      },
    ],
  },
  {
    id: "research",
    title: "I'm doing academic research & citations",
    icon: "graduation-cap",
    blurb: "Get your reference manager talking to Obsidian, then let spaced repetition do the memorizing.",
    loadouts: [
      {
        id: "academic",
        title: "References & study",
        problem: "I need my Zotero library and citations inside my notes, and I want to remember what I read.",
        summary:
          "Zotero Integration pulls citations, PDFs, and annotations straight from Zotero into notes. Citations is the lighter alternative if you just need to cite from a .bib file. Spaced Repetition turns any note into flashcards so studying compounds over time.",
        plugins: [
          {
            id: "obsidian-zotero-desktop-connector",
            name: "Zotero Integration",
            repo: "obsidian-community/obsidian-zotero-integration",
            role: "Import citations, PDF annotations, and formatted bibliographies from Zotero.",
            core: true,
            note: "Requires the Zotero desktop app; the heavier but more capable option.",
          },
          {
            id: "obsidian-citation-plugin",
            name: "Citations",
            repo: "hans/obsidian-citation-plugin",
            role: "Insert citations from a BibTeX/CSL library — simpler if you don't need full Zotero sync.",
            note: "Overlaps with Zotero Integration; pick one based on how deep your Zotero use is. Note it's been unmaintained since 2022 — lean toward Zotero Integration unless you specifically want the lighter tool.",
          },
          {
            id: "obsidian-spaced-repetition",
            name: "Spaced Repetition",
            repo: "st3v3nmw/obsidian-spaced-repetition",
            role: "Flashcards and note review scheduling, built on the SM-2 algorithm.",
          },
        ],
        tip: "Zotero Integration and Citations solve the same problem two ways — installing both just adds confusion. Choose one.",
      },
    ],
  },
  {
    id: "appearance",
    title: "I want my vault to look and feel nicer",
    icon: "palette",
    blurb: "A theme plus a settings panel gets you 90% there. Icons and toolbars are polish, not foundations.",
    loadouts: [
      {
        id: "look-and-feel",
        title: "Appearance & polish",
        problem: "The default look feels plain and I want to make it mine.",
        summary:
          "Most of 'making it pretty' is choosing a good theme, then Style Settings exposes that theme's knobs (fonts, spacing, colors) as toggles instead of CSS. Iconize adds icons to folders and notes. Commander lets you put buttons where you want them.",
        plugins: [
          {
            id: "obsidian-style-settings",
            name: "Style Settings",
            repo: "obsidian-community/obsidian-style-settings",
            role: "A control panel for theme options — customize without touching CSS. Many themes require it.",
            core: true,
          },
          {
            id: "obsidian-icon-folder",
            name: "Iconize",
            repo: "FlorianWoelki/obsidian-iconize",
            role: "Add icons to folders, files, and links for faster visual scanning.",
          },
          {
            id: "cmdr",
            name: "Commander",
            repo: "jsmorabito/obsidian-commander",
            role: "Add, hide, and rearrange command buttons across the ribbon, titlebar, and menus.",
          },
        ],
        tip: "Try a theme from Settings → Appearance before installing anything. Minimal and a few others cover most tastes on their own.",
      },
    ],
  },
  {
    id: "findability",
    title: "I keep losing notes / can't find things",
    icon: "search",
    blurb: "Better search, faster navigation, and tidy tags — so nothing disappears into the pile.",
    loadouts: [
      {
        id: "find-things",
        title: "Search & navigation",
        problem: "My vault grew and now I can't find what I know is in there.",
        summary:
          "Omnisearch adds fuzzy, ranked, typo-tolerant search far beyond core search. Recent Files gets you back to where you were. Tag Wrangler lets you rename and merge tags so your tagging doesn't rot.",
        plugins: [
          {
            id: "omnisearch",
            name: "Omnisearch",
            repo: "scambier/obsidian-omnisearch",
            role: "Smart, ranked, typo-tolerant search across your notes.",
            core: true,
            note: "To also search inside PDFs and images, add its companion plugin Text Extractor.",
          },
          {
            id: "recent-files-obsidian",
            name: "Recent Files",
            repo: "tgrosinger/recent-files-obsidian",
            role: "Jump back to recently opened notes from the sidebar.",
            core: true,
          },
          {
            id: "tag-wrangler",
            name: "Tag Wrangler",
            repo: "pjeby/tag-wrangler",
            role: "Rename, merge, and manage tags from the tag pane so they stay clean.",
          },
          {
            id: "various-complements",
            name: "Various Complements",
            repo: "tadashi-aikawa/obsidian-various-complements-plugin",
            role: "Auto-complete words, note titles, and tags as you type — fewer broken links from typos.",
          },
        ],
        tip: "Findability is mostly habits (consistent titles + links). These tools help, but don't out-tool a naming convention you'll actually keep.",
      },
    ],
  },
  {
    id: "automation",
    title: "I want to automate & build dashboards",
    icon: "wand-2",
    blurb: "The power-user tier. High leverage, higher learning curve — add these when you have a concrete workflow in mind.",
    loadouts: [
      {
        id: "power-tools",
        title: "Automation & dashboards",
        problem: "I keep doing the same manual steps and want my vault to assemble views for me.",
        summary:
          "For dashboards, start with Obsidian's built-in Bases core plugin — it builds tables and views natively, with a GUI and no query language. Dataview goes further with DQL when you need it (now in maintenance mode). Templater scripts repetitive note creation. QuickAdd wires it all to one-shortcut capture. Advanced URI lets other apps and shortcuts drive Obsidian from outside.",
        plugins: [
          {
            id: "dataview",
            name: "Dataview",
            repo: "blacksmithgu/obsidian-dataview",
            role: "Query notes into live tables/lists with DQL, when the core Bases GUI isn't enough.",
            note: "Turn on core Bases first for GUI dashboards; Dataview is in maintenance mode (last release 2025) but still unmatched for complex DQL.",
          },
          {
            id: "templater-obsidian",
            name: "Templater",
            repo: "SilentVoid13/Templater",
            role: "Scripted templates with logic, prompts, and system commands.",
            core: true,
          },
          {
            id: "quickadd",
            name: "QuickAdd",
            repo: "chhoumann/quickadd",
            role: "Capture and macro engine — one hotkey to run a chain of actions.",
          },
          {
            id: "obsidian-advanced-uri",
            name: "Advanced URI",
            repo: "Vinzent03/obsidian-advanced-uri",
            role: "Control Obsidian from outside — link to any action from shortcuts, scripts, or other apps.",
            note: "Advanced; only useful once you're integrating with tools beyond Obsidian.",
          },
        ],
        tip: "This tier rewards a specific goal ('a reading dashboard', 'auto-filed meeting notes'). Learn one plugin deeply before adding the next.",
      },
    ],
  },
  {
    id: "visual",
    title: "I think visually — diagrams & sketches",
    icon: "shapes",
    blurb: "For mind-mapping, sketchnoting, and spatial layouts. Obsidian's own Canvas already covers a lot.",
    loadouts: [
      {
        id: "visual-thinking",
        title: "Diagrams & visual thinking",
        problem: "I think in sketches and spatial maps, not walls of text.",
        summary:
          "Excalidraw brings a full hand-drawn whiteboard into your vault, with drawings that link to notes. Before installing much, try Obsidian's built-in Canvas core plugin — for many people it's already the spatial tool they wanted.",
        plugins: [
          {
            id: "obsidian-excalidraw-plugin",
            name: "Excalidraw",
            repo: "zsviczian/obsidian-excalidraw-plugin",
            role: "A powerful hand-drawn whiteboard with two-way links between sketches and notes.",
            core: true,
          },
          {
            id: "obsidian-kanban",
            name: "Kanban",
            repo: "obsidian-community/obsidian-kanban",
            role: "Board-style spatial layout for stages and workflows, stored as Markdown.",
          },
        ],
        tip: "Turn on the core Canvas plugin (Settings → Core plugins) first. If it isn't enough, then reach for Excalidraw.",
      },
    ],
  },
];
