import { Role } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const getStaffRole = (): Role => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  return server.roles.find(role => role.name.includes("Staff"));
};

export default getStaffRole;
