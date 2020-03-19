import { createConnection } from "typeorm";

// * Environment variables
const { NODE_ENV } = process.env;
const DATABASE_URL =
  NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DEV_DATABASE_URL;

// * Initialize DB connection
const initConnection = async () => {
  await createConnection({
    type: "postgres",
    extra: {
      ssl: true
    },
    url: DATABASE_URL,
    synchronize: true,
    logging: false,
    cache: true,
    entities: ["src/entities/**/*"],
    subscribers: ["src/subscribers/**/*"]
  })
    .then(() => console.log(`🗃️ Server is connected to database.`))
    .catch(e => {
      console.log(`⚠️ Cannot connect to database.`);
      console.error(e);
    });
};

export default initConnection;
