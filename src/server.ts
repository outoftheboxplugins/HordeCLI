import { spawnSync } from "child_process";

function resolveNuGetPackage(name: string): string {
  if (name.includes(".")) return name;
  return `OutOfTheBoxPlugins.Horde${name}`;
}

export function installServerPlugin(packageId: string, dir: string = process.cwd()): void {
  packageId = resolveNuGetPackage(packageId);
  console.log(`Installing server plugin: ${packageId}`);

  const result = spawnSync("dotnet", ["add", "package", packageId], {
    cwd: dir,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) process.exit(result.status ?? 1);

  console.log(`[${packageId}] installed`);
}
