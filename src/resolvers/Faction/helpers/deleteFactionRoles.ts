// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionRoles = (name: string) => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  const roles = server.roles.filter(role =>
    role.name.toLowerCase().includes(name.toLowerCase())
  );

  roles.forEach(role => role.delete());
};

export default deleteFactionRoles;
