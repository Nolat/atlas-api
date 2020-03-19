import { Role } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const createFactionRoles = (
  name: string,
  color: string,
  icon: string
): Promise<Role> =>
  new Promise(resolve => {
    const server = getDiscordGuild();
    if (!server) throw new Error("Discord Guild is not defined!");

    server
      .createRole({
        name: `${icon} Chef ${name}`,
        color,
        mentionable: true
      })
      .then(() => {
        resolve(
          server.createRole({ name: `${icon} ${name}`, color, hoist: true })
        );
      });
  });

export default createFactionRoles;
