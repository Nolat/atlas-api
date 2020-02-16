import { Guild } from "discord.js";

import client from "utils/discord/client";

// * Environment variables
const DISCORD_SERVER_ID: string = process.env.DISCORD_SERVER_ID!;

const getDiscordGuild = (): Guild | undefined => {
  const guild = client.CLIENT.guilds.get(DISCORD_SERVER_ID);
  return guild;
};

export default getDiscordGuild;
