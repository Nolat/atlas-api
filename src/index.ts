import "reflect-metadata";
import "lib/env";

// * Utils
import { initConnection } from "utils/connection";
import { initDiscord } from "utils/discord";
import { initServer } from "utils/server";

const setupAPI = async () => {
  // * Start database connection
  await initConnection();

  // * Start Discord client
  await initDiscord();

  // * Start Express & GraphQL Server
  await initServer();
};

setupAPI();
