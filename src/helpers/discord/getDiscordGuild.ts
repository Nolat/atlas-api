import { Guild } from "discord.js";

import client from "utils/discord/DiscordClient";

// * Environment variables
const { DISCORD_SERVER_ID } = process.env;

const getDiscordGuild = (): Guild | undefined => {
  return client.CLIENT.guilds.get(DISCORD_SERVER_ID);
};

export default getDiscordGuild;
