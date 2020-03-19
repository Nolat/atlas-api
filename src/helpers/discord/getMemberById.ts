import { GuildMember } from "discord.js";

import getDiscordGuild from "./getDiscordGuild";

const getMemberById = (id: string): GuildMember => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  return server.members.find(m => m.id === id);
};

export default getMemberById;
