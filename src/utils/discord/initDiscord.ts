import client from "./client";

const initDiscord = () => {
  client.start();
  console.log(`🤖 Discord client is online.`);
};

export default initDiscord;
