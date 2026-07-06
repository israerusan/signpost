// Minimal stand-in for the `obsidian` module so any test that transitively
// imports it can be bundled and executed under Node. The catalog and its
// validator are pure data and do not import `obsidian`; this exists only as a
// safety net for the esbuild alias.
export const apiVersion = "1.5.0";
