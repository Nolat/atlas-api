/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/namespace */
import "reflect-metadata";
import "lib/env";
import * as environment from "environment";

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
