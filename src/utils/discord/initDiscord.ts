import client from "./client";

const initDiscord = () =>
  new Promise(resolve => {
    client.start();
    console.log(`🤖 Discord client is online.`);
    resolve();
  });

export default initDiscord;
