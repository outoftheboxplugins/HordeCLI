import { detectContext, HordeContext } from "./context";
import { installDashboardPlugin } from "./dashboard";
import { installServerPlugin } from "./server";
import { installFromRoot } from "./root";

const [, , command, ...rest] = process.argv;

const cwd = process.cwd();

if (command === "install" || command === "i") {
  const name = rest[0];

  if (!name) {
    console.error("Usage: horde-plugins-cli install <plugin-id>");
    process.exit(1);
  }

  const context = detectContext(cwd);
  console.log(`Context: ${context}`);

  switch (context) {
    case HordeContext.Dashboard: {
      installDashboardPlugin(name, cwd);
      break;
    }

    case HordeContext.Server: {
      installServerPlugin(name, cwd);
      break;
    }

    case HordeContext.Root: {
      installFromRoot(cwd, name);
      break;
    }

    case HordeContext.Unknown:
      console.error(
        "Could not detect Horde context. Run from:\n" +
          "  Horde                - installs server and dashboard plugin bundles from a predefined list\n" +
          "  Horde/HordeDashboard - installs dashboard plugins via NPM\n" +
          "  Horde/HordeServer    - installs server plugins via NuGet"
      );
      process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
