// Validates the bundled route map. Because the catalog is the entire product and
// is hand-edited, these checks guard the invariants the UI and the install/deep-link
// logic depend on: real-looking ids, GitHub repo slugs, unique keys, and at least
// one "start here" pick per loadout.
import assert from "node:assert";
import { CATALOG } from "../src/data/catalog";

const catIds = new Set<string>();
const loadoutIds = new Set<string>();
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
      assert.ok(
        /^[^/\s]+\/[^/\s]+$/.test(p.repo),
        `plugin ${p.id} repo must be "owner/repo": got "${p.repo}"`
      );
      assert.ok(p.role.length > 0, `plugin ${p.id} needs a role description`);
    }
  }
}

console.log(`ok  catalog.test.ts (${catIds.size} categories, ${loadoutIds.size} loadouts, ${pluginCount} picks)`);
