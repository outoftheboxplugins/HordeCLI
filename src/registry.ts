export type PluginDef = {
  /** Short identifier used on the CLI */
  id: string;
  /** NuGet package ids. */
  serverPackages?: string[];
  /** Npm package names */
  dashboardPackages?: string[];
};

export const PLUGINS: PluginDef[] = [
  {
    id: "storage-reporter",
    dashboardPackages: ["storage-reporter"],
    serverPackages: ["OutOfTheBoxPlugins.HordeStorageReporter"],
  },
  {
    id: "tools-uploader",
    dashboardPackages: ["tools-uploader"],
    serverPackages: ["OutOfTheBoxPlugins.HordeToolUploader"],
  },
  {
    id: "discord-notifications",
    serverPackages: ["OutOfTheBoxPlugins.HordeDiscordNotifications"],
  },
  {
    id: "email-notifications",
    serverPackages: ["OutOfTheBoxPlugins.HordeEmailNotifications"],
  },
];

export function findPlugin(id: string): PluginDef | undefined {
  return PLUGINS.find((p) => p.id === id);
}
