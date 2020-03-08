import { GuildMember, Role } from "discord.js";

// * Utils
import getDiscordGuild from "helpers/discord/getDiscordGuild";
import getMemberById from "helpers/discord/getMemberById";

const giveFactionRole = async (id: string, name: string) => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  const member: GuildMember = getMemberById(id);
  const role: Role = server.roles.find(
    r => r.name.includes(name) && !r.name.includes("Chef")
  );

  member.addRole(role);
};

export default giveFactionRole;
