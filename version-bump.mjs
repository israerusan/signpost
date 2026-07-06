// Keeps the three version files in lockstep. Run automatically by the npm
// "version" hook: `npm version patch|minor|major` bumps package.json, then this
// writes the same version into manifest.json and adds a versions.json entry
// mapping it to the current minAppVersion. Prevents the classic release foot-gun
// of updating manifest but forgetting versions.json (which breaks update offers).
import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;
if (!targetVersion) {
  throw new Error("npm_package_version is not set — run this via `npm version`.");
}

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, 2) + "\n");

const versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t") + "\n");
