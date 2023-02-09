import { type NextPage } from "next";
import Head from "next/head";

import { AutoAnimate } from "@/components/auto-animate";
import { Code } from "@/components/code";
import { AddButton, AppCard, DatabaseCard, EnvCard, Section } from "@/components/cards";
import { generateDockerCompose } from "@/utils/generate-docker-compose";
import { useProjectConfig } from "@/utils/use-project-config";

const Home: NextPage = () => {
  const {
    projectConfig,
    addApp,
    addEnv,
    addDatabase,
    updateAppName,
    updateAppTech,
    updateEnvName,
    updateDatabaseName,
    updateDatabaseType,
    removeApp,
    removeEnv,
    removeDatabase,
  } = useProjectConfig();

  return (
    <>
      <Head>
        <title>GIA - Home</title>
        <meta name="description" content="GitHub Infrastructure Automation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-10 px-4 py-4 ">
          <hgroup>
            <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              GIA
            </h1>

            <p className="text-center text-2xl tracking-tight text-white">
              Github Infrastructure Automation
            </p>
          </hgroup>

          <p className="text-xl text-white">
            Generate opinionated docker-compose files for your projects
          </p>

          <div
            className="grid w-full  gap-4 text-white"
            style={{ gridTemplateColumns: "1fr 35vw" }}
          >
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-x-4 text-sm">
                <h2 className="text-3xl">Project</h2>

                <AddButton onClick={addEnv} label="Add Env" />
                <AddButton onClick={addApp} label="Add App" />
                <AddButton onClick={addDatabase} label="Add Database" />
              </div>

              <Section title="Envs">
                <AutoAnimate as="ul" className="grid grid-cols-2 flex-wrap gap-4">
                  {projectConfig.envs.map((env) => (
                    <EnvCard
                      key={env.id}
                      onChange={(newValue) => updateEnvName(env.id, newValue)}
                      onDelete={() => removeEnv(env.id)}
                    />
                  ))}
                </AutoAnimate>
              </Section>

              <Section title="Apps">
                <AutoAnimate as="ul" className="grid grid-cols-2 flex-wrap gap-4">
                  {projectConfig.apps.map((app) => (
                    <AppCard
                      key={app.id}
                      onChange={(newValue) => updateAppName(app.id, newValue)}
                      onDelete={() => removeApp(app.id)}
                      updateAppTech={(tech) => updateAppTech(app.id, tech)}
                    />
                  ))}
                </AutoAnimate>
              </Section>

              <Section title="Databases">
                <AutoAnimate as="ul" className="flex flex-col gap-y-4">
                  {projectConfig.databases.map((db) => (
                    <DatabaseCard
                      key={db.id}
                      onChange={(newValue) => updateDatabaseName(db.id, newValue)}
                      onDelete={() => removeDatabase(db.id)}
                      updateDatabaseType={(type) => updateDatabaseType(db.id, type)}
                    />
                  ))}
                </AutoAnimate>
              </Section>
            </div>

            <div className="flex flex-col gap-y-4">
              <h2 className="text-3xl">Output</h2>

              <Code content={generateDockerCompose(projectConfig)} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
