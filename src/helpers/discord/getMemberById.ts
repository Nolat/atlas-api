import { Guild, GuildMember } from "discord.js";

import getDiscordGuild from "./getDiscordGuild";

const getMemberById = (id: string): GuildMember => {
  const guild: Guild = getDiscordGuild()!;
  const member: GuildMember = guild.members.find(m => m.id === id);
  return member;
};

export default getMemberById;
