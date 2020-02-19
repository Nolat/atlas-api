import { Guild } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionRoles = (name: string) => {
  const server: Guild = getDiscordGuild()!;
  const roles = server.roles.filter(role =>
    role.name.toLowerCase().includes(name.toLowerCase())
  );

  roles.forEach(role => role.delete());
};

export default deleteFactionRoles;
