import { appendFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import ora from "ora";

function resolveNpmPackage(name: string): string {
  if (name.startsWith("@")) return name;
  return `@outoftheboxplugins/horde-${name}`;
}

export function installDashboardPlugin(packageId: string, dir: string = process.cwd()): void {
  packageId = resolveNpmPackage(packageId);

  const installSpinner = ora(`Installing ${packageId}`).start();

  const result = spawnSync("npm", ["install", "--save", "--legacy-peer-deps", packageId], {
    cwd: dir,
    stdio: "pipe",
    shell: true,
  });

  if (result.status !== 0) {
    installSpinner.fail(`${packageId} failed`);
    console.error(result.stdout?.toString());
    console.error(result.stderr?.toString());
    process.exit(result.status ?? 1);
  }

  installSpinner.succeed(`${packageId} installed`);

  const registry = join(dir, "plugins", "registry.ts");

  if (!existsSync(registry)) {
    console.error(`plugins/registry.ts not found in ${dir}`);
    process.exit(1);
  }

  const importLine = `import "${packageId}";`;
  const content = readFileSync(registry, "utf8");

  if (content.includes(importLine)) {
    ora().info(`${packageId} already registered`);
    return;
  }

  appendFileSync(registry, "\n" + importLine + "\n");
  ora().succeed(`${packageId} registered`);
}
