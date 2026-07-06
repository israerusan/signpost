// Guards the crash path a previous review pass found: a malformed persisted
// data.json (null / wrong-typed collapsedCategories, corrupt hideInstalled) must
// never reach the view as an invalid shape.
import assert from "node:assert";
import { sanitizeSettings, DEFAULT_SETTINGS } from "../src/core/settings";

// Missing / empty input -> defaults.
assert.deepEqual(sanitizeSettings(null), DEFAULT_SETTINGS);
assert.deepEqual(sanitizeSettings(undefined), DEFAULT_SETTINGS);
assert.deepEqual(sanitizeSettings({}), DEFAULT_SETTINGS);

// The reported crash: collapsedCategories is null / a string / a number.
assert.deepEqual(sanitizeSettings({ collapsedCategories: null }).collapsedCategories, []);
assert.deepEqual(sanitizeSettings({ collapsedCategories: "start-here" }).collapsedCategories, []);
assert.deepEqual(sanitizeSettings({ collapsedCategories: 42 }).collapsedCategories, []);

// Mixed array -> only the string entries survive.
assert.deepEqual(
  sanitizeSettings({ collapsedCategories: ["a", 1, null, "b", {}] }).collapsedCategories,
  ["a", "b"]
);

// hideInstalled coerces to a strict boolean.
assert.equal(sanitizeSettings({ hideInstalled: "yes" }).hideInstalled, false);
assert.equal(sanitizeSettings({ hideInstalled: 1 }).hideInstalled, false);
assert.equal(sanitizeSettings({ hideInstalled: true }).hideInstalled, true);

// version falls back when absent or wrong-typed.
assert.equal(sanitizeSettings({ version: "3" }).version, DEFAULT_SETTINGS.version);
assert.equal(sanitizeSettings({ version: 2 }).version, 2);

// A valid, complete object round-trips unchanged.
assert.deepEqual(
  sanitizeSettings({ version: 1, collapsedCategories: ["x"], hideInstalled: true }),
  { version: 1, collapsedCategories: ["x"], hideInstalled: true }
);

// Non-object garbage (array, string, number) -> defaults, no throw.
assert.deepEqual(sanitizeSettings([1, 2, 3]), DEFAULT_SETTINGS);
assert.deepEqual(sanitizeSettings("nope"), DEFAULT_SETTINGS);

console.log("ok  settings.test.ts");
