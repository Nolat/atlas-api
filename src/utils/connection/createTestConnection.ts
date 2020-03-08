import { createConnection } from "typeorm";

// * Environment variables
const { TEST_DATABASE_URL } = process.env;

// * Initialize DB connection
const createTestConnection = async () =>
  createConnection({
    type: "postgres",
    extra: {
      ssl: true
    },
    url: TEST_DATABASE_URL,
    synchronize: true,
    logging: false,
    cache: false,
    dropSchema: true,
    entities: ["src/entities/**/*"],
    subscribers: ["src/subscribers/**/*"]
  });

export default createTestConnection;
