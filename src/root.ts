import { join } from "path";
import { installDashboardPlugin } from "./dashboard";
import { installServerPlugin } from "./server";
import { findPlugin } from "./registry";

export function installFromRoot(dir: string, entryName: string): void {
  const plugin = findPlugin(entryName);
  if (!plugin) {
    console.error(`Unknown plugin: ${entryName}`);
    process.exit(1);
  }

  const serverDir = join(dir, "HordeServer");
  const dashboardDir = join(dir, "HordeDashboard");

  for (const pkg of plugin.serverPackages ?? []) {
    installServerPlugin(pkg, serverDir);
  }

  for (const pkg of plugin.dashboardPackages ?? []) {
    installDashboardPlugin(pkg, dashboardDir);
  }
}
