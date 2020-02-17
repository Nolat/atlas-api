import { Guild, Role } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const getStaffRole = async (): Promise<Role> => {
  const server: Guild = getDiscordGuild()!;

  return server.roles.find(role => role.name.includes("Staff"));
};

export default getStaffRole;
