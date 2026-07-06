// Validates the bundled route map. Because the catalog is the entire product and
// is hand-edited, these checks guard the invariants the UI and the install/deep-link
// logic depend on: real-looking ids, GitHub repo slugs, unique keys, and at least
// one "start here" pick per loadout.
import assert from "node:assert";
import { CATALOG } from "../src/data/catalog";

const catIds = new Set<string>();
const loadoutIds = new Set<string>();
// A plugin id can legitimately appear in more than one loadout, but every field
// derived from that id (repo, name) must be identical everywhere — otherwise one
// occurrence's "GitHub" link points somewhere different from another's.
const repoById = new Map<string, string>();
const nameById = new Map<string, string>();
let pluginCount = 0;

assert.ok(CATALOG.length > 0, "catalog must not be empty");

for (const cat of CATALOG) {
  assert.ok(cat.id && /^[a-z0-9-]+$/.test(cat.id), `category id invalid: ${cat.id}`);
  assert.ok(!catIds.has(cat.id), `duplicate category id: ${cat.id}`);
  catIds.add(cat.id);
  assert.ok(cat.title.length > 0, `category ${cat.id} needs a title`);
  assert.ok(cat.icon.length > 0, `category ${cat.id} needs an icon`);
  assert.ok(cat.blurb.length > 0, `category ${cat.id} needs a blurb`);
  assert.ok(cat.loadouts.length > 0, `category ${cat.id} has no loadouts`);

  for (const lo of cat.loadouts) {
    assert.ok(lo.id && /^[a-z0-9-]+$/.test(lo.id), `loadout id invalid: ${lo.id}`);
    assert.ok(!loadoutIds.has(lo.id), `duplicate loadout id: ${lo.id}`);
    loadoutIds.add(lo.id);
    assert.ok(lo.problem.length > 0, `loadout ${lo.id} needs a problem statement`);
    assert.ok(lo.summary.length > 0, `loadout ${lo.id} needs a summary`);
    assert.ok(lo.plugins.length > 0, `loadout ${lo.id} has no plugins`);
    assert.ok(
      lo.plugins.some((p) => p.core),
      `loadout ${lo.id} must mark at least one plugin as core (the "start here" pick)`
    );

    const seen = new Set<string>();
    for (const p of lo.plugins) {
      pluginCount++;
      assert.ok(p.id && /^[a-z0-9-]+$/.test(p.id), `plugin id invalid in ${lo.id}: ${p.id}`);
      assert.ok(!seen.has(p.id), `duplicate plugin ${p.id} within loadout ${lo.id}`);
      seen.add(p.id);
      assert.ok(p.name.length > 0, `plugin ${p.id} needs a name`);
      // GitHub owner/repo charset only — excludes URL-significant chars (?, #, :,
      // whitespace) so `https://github.com/${repo}` can only ever be a github.com
      // path, never a different host/scheme or a query/fragment breakout.
      assert.ok(
        /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(p.repo),
        `plugin ${p.id} repo must be "owner/repo" (GitHub charset): got "${p.repo}"`
      );
      assert.ok(p.role.length > 0, `plugin ${p.id} needs a role description`);

      const knownRepo = repoById.get(p.id);
      if (knownRepo === undefined) repoById.set(p.id, p.repo);
      else assert.equal(p.repo, knownRepo, `plugin ${p.id} maps to two different repos: "${knownRepo}" vs "${p.repo}"`);
      const knownName = nameById.get(p.id);
      if (knownName === undefined) nameById.set(p.id, p.name);
      else assert.equal(p.name, knownName, `plugin ${p.id} shown under two different names: "${knownName}" vs "${p.name}"`);
    }
  }
}

console.log(`ok  catalog.test.ts (${catIds.size} categories, ${loadoutIds.size} loadouts, ${pluginCount} picks)`);
