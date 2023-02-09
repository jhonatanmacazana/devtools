type AppTech = {
  label: string;
  extra: Record<string, string[]> | null;
};

export const techs = [
  {
    label: "node",
    extra: {
      // packageManagers: ["npm", "yarn", "pnpm"],
    },
  },
  {
    label: "react",
    extra: {
      // packageManagers: ["npm", "yarn", "pnpm"],
      // frameworks: ["next", "vite"],
    },
  },
  { label: "python", extra: null },
] as AppTech[];

export type DatabaseTypes = "postgres" | "mysql" | "mongo";

type DatabaseType = {
  label: DatabaseTypes;
};

export const databaseTypes: DatabaseType[] = [
  { label: "postgres" },
  { label: "mysql" },
  // { label: "mongo" },
];
