import { spawnSync } from "child_process";
import ora from "ora";

function resolveNuGetPackage(name: string): string {
  if (name.includes(".")) return name;
  return `OutOfTheBoxPlugins.Horde${name}`;
}

export function installServerPlugin(packageId: string, dir: string = process.cwd()): void {
  packageId = resolveNuGetPackage(packageId);

  const spinner = ora(`Installing ${packageId}`).start();

  const result = spawnSync("dotnet", ["add", "package", packageId], {
    cwd: dir,
    stdio: "pipe",
    shell: true,
  });

  if (result.status !== 0) {
    spinner.fail(`${packageId} failed`);
    console.error(result.stdout?.toString());
    console.error(result.stderr?.toString());
    process.exit(result.status ?? 1);
  }

  spinner.succeed(`${packageId} installed`);
}
