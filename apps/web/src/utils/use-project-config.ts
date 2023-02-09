import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

import type { DatabaseTypes } from "./defaults";

export type ProjectConfig = {
  envs: { id: string; name: string }[];
  apps: { id: string; name: string; tech: string }[];
  databases: { id: string; name: string; type: DatabaseTypes }[];
};

export const useProjectConfig = () => {
  const [config, setConfig] = useState<ProjectConfig>({ envs: [], apps: [], databases: [] });

  const addApp = useCallback(() => {
    setConfig((old) => ({
      ...old,
      apps: [...old.apps, { id: uuid(), name: "", tech: "" }],
    }));
  }, []);

  const updateAppName = useCallback((id: string, name: string) => {
    setConfig((old) => ({
      ...old,
      apps: old.apps.map((app) => {
        if (app.id === id) return { ...app, name };
        return app;
      }),
    }));
  }, []);

  const updateAppTech = useCallback((id: string, tech: string) => {
    setConfig((old) => ({
      ...old,
      apps: old.apps.map((app) => {
        if (app.id === id) return { ...app, tech };
        return app;
      }),
    }));
  }, []);

  const removeApp = useCallback((id: string) => {
    setConfig((old) => ({
      ...old,
      apps: old.apps.filter((app) => app.id !== id),
    }));
  }, []);

  const addEnv = useCallback(() => {
    setConfig((old) => ({ ...old, envs: [...old.envs, { id: uuid(), name: "" }] }));
  }, []);

  const updateEnvName = useCallback((id: string, name: string) => {
    setConfig((old) => ({
      ...old,
      envs: old.envs.map((env) => {
        if (env.id === id) return { ...env, name };
        return env;
      }),
    }));
  }, []);

  const removeEnv = useCallback((id: string) => {
    setConfig((old) => ({
      ...old,
      envs: old.envs.filter((env) => env.id !== id),
    }));
  }, []);

  const addDatabase = useCallback(() => {
    setConfig((old) => ({
      ...old,
      databases: [...old.databases, { id: uuid(), name: "", type: "postgres" }],
    }));
  }, []);

  const updateDatabaseName = useCallback((id: string, name: string) => {
    setConfig((old) => ({
      ...old,
      databases: old.databases.map((database) => {
        if (database.id === id) return { ...database, name };
        return database;
      }),
    }));
  }, []);

  const updateDatabaseType = useCallback((id: string, type: DatabaseTypes) => {
    setConfig((old) => ({
      ...old,
      databases: old.databases.map((database) => {
        if (database.id === id) return { ...database, type };
        return database;
      }),
    }));
  }, []);

  const removeDatabase = useCallback((id: string) => {
    setConfig((old) => ({
      ...old,
      databases: old.databases.filter((database) => database.id !== id),
    }));
  }, []);

  return {
    projectConfig: config,
    addApp,
    updateAppName,
    updateAppTech,
    removeApp,
    addDatabase,
    updateDatabaseName,
    updateDatabaseType,
    removeDatabase,
    addEnv,
    updateEnvName,
    removeEnv,
  };
};
