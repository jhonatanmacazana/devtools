import YAML from "yaml";
import type { DatabaseTypes } from "./defaults";

import type {
  ComposeSpecification,
  DefinitionsService,
  PropertiesNetworks,
  PropertiesServices,
  PropertiesVolumes,
} from "./docker-compose";
import type { ProjectConfig } from "./use-project-config";

const output: ComposeSpecification = {
  version: "3.9",
};

export const generateDockerCompose = (projectConfig: ProjectConfig) => {
  if (projectConfig.apps.length === 0) return YAML.stringify(output);

  const propertiesServices: PropertiesServices = {};
  const propertiesNetworks: PropertiesNetworks = {};
  const propertiesVolumes: PropertiesVolumes = {};

  for (const app of projectConfig.apps) {
    const appName = app.name;
    if (!appName) continue;

    const envNames = projectConfig.envs.map((env) => env.name.trim()).filter(Boolean);

    if (envNames.length > 0) {
      for (const envName of envNames) {
        const serviceName = `${appName}_${envName}`;
        const networkName = `internal_${envName}`;
        const imageName = `${appName}:${envName}`;
        const newServiceDefinition: DefinitionsService = {
          image: imageName,
          networks: [networkName],
        };

        propertiesServices[serviceName] = newServiceDefinition;
        propertiesNetworks[networkName] = {};
      }

      continue;
    }

    const serviceName = `${appName}-service`;
    const newServiceDefinition: DefinitionsService = {
      image: appName,
    };

    propertiesServices[serviceName] = newServiceDefinition;
  }

  for (const database of projectConfig.databases) {
    const databaseName = database.name;
    if (!databaseName) continue;

    const envNames = projectConfig.envs.map((env) => env.name.trim()).filter(Boolean);

    if (envNames.length > 0) {
      for (const envName of envNames) {
        const serviceName = `${databaseName}_${envName}`;
        const networkName = `internal_${envName}`;

        propertiesServices[serviceName] = buildDatabaseService(databaseName, database.type, envName);
        propertiesNetworks[networkName] = {};
        propertiesVolumes[`${databaseName}_data`] = {};
      }

      continue;
    }

    const serviceName = `${databaseName}-service`;

    propertiesServices[serviceName] = buildDatabaseService(databaseName, database.type);
    propertiesVolumes[`${databaseName}_data`] = {};
  }

  output.services = Object.keys(propertiesServices).length > 0 ? propertiesServices : undefined;
  output.networks = Object.keys(propertiesNetworks).length > 0 ? propertiesNetworks : undefined;
  output.volumes = Object.keys(propertiesVolumes).length > 0 ? propertiesVolumes : undefined;

  return YAML.stringify(output);
};

function buildDatabaseService(
  name: string,
  type: DatabaseTypes,
  envName?: string
): DefinitionsService {
  const networks = envName ? [`internal_${envName}`] : undefined;

  if (type === "mysql") {
    return {
      environment: ["MYSQL_DATABASE=", "MYSQL_ROOT_PASSWORD=", "MYSQL_USER=", "MYSQL_PASSWORD="],
      expose: [3306],
      image: "mysql:8.0",
      networks,
      restart: "unless-stopped",
      volumes: [`${name}_data:/var/lib/mysql`],
    };
  }

  // if (type === "mongo") {
  //   return {
  //     image: "mongo",
  //     environment: ["POSTGRES_USER=", "POSTGRES_PASSWORD=", "POSTGRES_DB="],
  //     expose: [5432],
  //     restart: "unless-stopped",
  //     volumes: [`${name}_data:/var/lib/postgresql/data`],
  //     networks,
  //   };
  // }

  return {
    environment: ["POSTGRES_USER=", "POSTGRES_PASSWORD=", "POSTGRES_DB="],
    expose: [5432],
    image: "postgres:15.1",
    networks,
    restart: "unless-stopped",
    volumes: [`${name}_data:/var/lib/postgresql/data`],
  };
}
