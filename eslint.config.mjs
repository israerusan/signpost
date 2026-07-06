import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";

/**
 * Runs the SAME ruleset as Obsidian's automated community-plugin review
 * (eslint-plugin-obsidianmd) so review failures are caught locally before a release
 * — plus our own type-aware rules on the plugin source. `npm run lint` is a hard
 * gate (`--max-warnings 0`); a warning can still block review.
 */
export default tseslint.config(
	{
		ignores: [
			"main.js",
			"node_modules/**",
			"test/**",
			"scripts/**",
			"esbuild.config.mjs",
			"eslint.config.mjs",
			"version-bump.mjs",
			"src/**/*.mjs",
			"src/**/*.d.mts",
		],
	},
	...obsidianmd.configs.recommended,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// Product/brand names in copy ("GitHub", "Dataview", "Pro") are correct as
			// written; the real review does not flag them.
			"obsidianmd/ui/sentence-case": "off",
			// Targets minAppVersion 1.4.0 and uses the classic display() settings tab.
			"obsidianmd/settings-tab/prefer-setting-definitions": "off",
		},
	}
);
