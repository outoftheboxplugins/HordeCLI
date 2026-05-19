import { existsSync, readFileSync } from "fs";
import { join } from "path";

export enum HordeContext {
  Root = "Root",
  Server = "Server",
  Dashboard = "Dashboard",
  Unknown = "Unknown",
}

// Priority: Root > Server > Dashboard > Unknown
// Root:      Horde.sln present
// Server:    HordeServer.csproj present
// Dashboard: package.json with name "horde-dashboard"
export function detectContext(dir: string = process.cwd()): HordeContext {
  const hordeSolution = join(dir, "Horde.sln");
  if (existsSync(hordeSolution)) {
    return HordeContext.Root;
  }

  const hordeServerProject = join(dir, "HordeServer.csproj");
  if (existsSync(hordeServerProject)) {
    return HordeContext.Server;
  }

  const packageJson = join(dir, "package.json");
  if (existsSync(packageJson)) {
    try {
      if (JSON.parse(readFileSync(packageJson, "utf8")).name === "horde-dashboard") {
        return HordeContext.Dashboard;
      }
    } catch {}
  }

  return HordeContext.Unknown;
}
