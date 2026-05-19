import { appendFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

function resolveNpmPackage(name: string): string {
  if (name.startsWith("@")) return name;
  return `@outoftheboxplugins/horde-${name}`;
}

export function installDashboardPlugin(packageId: string, dir: string = process.cwd()): void {
  packageId = resolveNpmPackage(packageId);
  console.log(`Installing dashboard plugin: ${packageId}`);

  const result = spawnSync("npm", ["install", "--save", "--legacy-peer-deps", packageId], {
    cwd: dir,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) process.exit(result.status ?? 1);

  const registry = join(dir, "plugins", "registry.ts");

  if (!existsSync(registry)) {
    console.error(`plugins/registry.ts not found in ${dir}`);
    process.exit(1);
  }

  const importLine = `import "${packageId}";`;
  const content = readFileSync(registry, "utf8");

  if (content.includes(importLine)) {
    console.log(`[${packageId}] already registered`);
    return;
  }

  appendFileSync(registry, "\n" + importLine + "\n");
  console.log(`[${packageId}] registered in plugins/registry.ts`);
}
