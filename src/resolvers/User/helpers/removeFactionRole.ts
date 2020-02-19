import { GuildMember, Guild } from "discord.js";

// * Utils
import getDiscordGuild from "helpers/discord/getDiscordGuild";
import getMemberById from "helpers/discord/getMemberById";

const removeFactionRole = async (id: string, name: string) => {
  const server: Guild = getDiscordGuild()!;
  const member: GuildMember = getMemberById(id);
  const roles = server.roles.filter(r => r.name.includes(name));

  member.removeRoles(roles);
};

export default removeFactionRole;
