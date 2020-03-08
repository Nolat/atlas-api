export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      SECRET_TOKEN: string;
      DATABASE_URL: string;
      DEV_DATABASE_URL: string;
      TEST_DATABASE_URL: string;
      DISCORD_SERVER_ID: string;
      DISCORD_TOKEN: string;
    }
  }
}
