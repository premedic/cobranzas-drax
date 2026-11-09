#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_DIRS = ["arch", "back", "front"];
const DEPENDENCY_SECTIONS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const install = !args.has("--no-install") && !dryRun;

if (args.has("--help") || args.has("-h")) {
    console.log(`Usage: ./update-drax-dependencies.mjs [--dry-run] [--no-install]

Updates @drax dependencies in arch, back and front package.json files when the latest npm version keeps the same major version.

Options:
  --dry-run      Show pending updates without writing files or running npm install.
  --no-install   Update package.json files without running npm install.
`);
    process.exit(0);
}

const rootDir = dirname(fileURLToPath(import.meta.url));
const latestVersionCache = new Map();

function parseVersionSpec(spec) {
    if (typeof spec !== "string") {
        return null;
    }

    const match = spec.match(/^([~^]?)(\d+)\.(\d+)\.(\d+(?:[-+][0-9A-Za-z.-]+)?)/);

    if (!match) {
        return null;
    }

    return {
        prefix: match[1],
        version: `${match[2]}.${match[3]}.${match[4]}`,
        major: Number(match[2]),
        minor: Number(match[3]),
        patch: Number(match[4].split(/[+-]/)[0])
    };
}

function parsePlainVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?$/);

    if (!match) {
        return null;
    }

    return {
        version,
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3])
    };
}

function compareVersions(a, b) {
    if (a.major !== b.major) {
        return a.major - b.major;
    }

    if (a.minor !== b.minor) {
        return a.minor - b.minor;
    }

    return a.patch - b.patch;
}

function npmViewLatest(packageName) {
    if (latestVersionCache.has(packageName)) {
        return latestVersionCache.get(packageName);
    }

    const result = spawnSync("npm", ["view", packageName, "version", "--json"], {
        cwd: rootDir,
        encoding: "utf8"
    });

    if (result.status !== 0) {
        const message = result.stderr.trim() || result.stdout.trim();
        throw new Error(`Could not read latest version for ${packageName}: ${message}`);
    }

    const rawVersion = result.stdout.trim();
    const latest = JSON.parse(rawVersion);
    const version = Array.isArray(latest) ? latest.at(-1) : latest;

    if (typeof version !== "string") {
        throw new Error(`npm returned an invalid version for ${packageName}: ${rawVersion}`);
    }

    latestVersionCache.set(packageName, version);
    return version;
}

async function readPackageJson(packageDir) {
    const packagePath = join(rootDir, packageDir, "package.json");
    const content = await readFile(packagePath, "utf8");

    return {
        packagePath,
        data: JSON.parse(content)
    };
}

function collectDraxDependencies(packageJson) {
    const dependencies = [];

    for (const section of DEPENDENCY_SECTIONS) {
        const sectionDependencies = packageJson[section];

        if (!sectionDependencies) {
            continue;
        }

        for (const [name, spec] of Object.entries(sectionDependencies)) {
            if (name.startsWith("@drax/")) {
                dependencies.push({ section, name, spec });
            }
        }
    }

    return dependencies;
}

const changedPackageDirs = [];
const updates = [];
const skippedMajorUpdates = [];
const skippedUnsupportedSpecs = [];

for (const packageDir of PACKAGE_DIRS) {
    const { packagePath, data } = await readPackageJson(packageDir);
    const draxDependencies = collectDraxDependencies(data);
    let changed = false;

    for (const dependency of draxDependencies) {
        const current = parseVersionSpec(dependency.spec);

        if (!current) {
            skippedUnsupportedSpecs.push({
                packageDir,
                name: dependency.name,
                spec: dependency.spec
            });
            continue;
        }

        const latestVersion = npmViewLatest(dependency.name);
        const latest = parsePlainVersion(latestVersion);

        if (!latest) {
            skippedUnsupportedSpecs.push({
                packageDir,
                name: dependency.name,
                spec: latestVersion
            });
            continue;
        }

        if (latest.major !== current.major) {
            skippedMajorUpdates.push({
                packageDir,
                name: dependency.name,
                current: dependency.spec,
                latest: latest.version
            });
            continue;
        }

        if (compareVersions(latest, current) <= 0) {
            continue;
        }

        const nextSpec = `${current.prefix}${latest.version}`;
        data[dependency.section][dependency.name] = nextSpec;
        changed = true;
        updates.push({
            packageDir,
            name: dependency.name,
            from: dependency.spec,
            to: nextSpec
        });
    }

    if (changed) {
        changedPackageDirs.push(packageDir);

        if (!dryRun) {
            await writeFile(packagePath, `${JSON.stringify(data, null, 2)}\n`);
        }
    }
}

if (updates.length === 0) {
    console.log("No @drax dependencies need same-major updates.");
} else {
    console.log(dryRun ? "Pending @drax dependency updates:" : "Updated @drax dependencies:");

    for (const update of updates) {
        console.log(`- ${update.packageDir}: ${update.name} ${update.from} -> ${update.to}`);
    }
}

if (skippedMajorUpdates.length > 0) {
    console.log("");
    console.log("Skipped major-version updates:");

    for (const skipped of skippedMajorUpdates) {
        console.log(`- ${skipped.packageDir}: ${skipped.name} ${skipped.current} -> ${skipped.latest}`);
    }
}

if (skippedUnsupportedSpecs.length > 0) {
    console.log("");
    console.log("Skipped unsupported version specs:");

    for (const skipped of skippedUnsupportedSpecs) {
        console.log(`- ${skipped.packageDir}: ${skipped.name} ${skipped.spec}`);
    }
}

if (dryRun || changedPackageDirs.length === 0 || !install) {
    if (dryRun) {
        console.log("");
        console.log("Dry run complete. No files were changed and npm install was not run.");
    }
    process.exit(0);
}

for (const packageDir of changedPackageDirs) {
    console.log("");
    console.log(`Running npm install in ${packageDir}...`);

    const result = spawnSync("npm", ["install"], {
        cwd: join(rootDir, packageDir),
        stdio: "inherit"
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}
