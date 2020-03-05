import { Role } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";
import getStaffRole from "helpers/discord/getStaffRole";

const createFactionChannels = async (
  name: string,
  icon: string,
  role: Role
) => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  const staff: Role = getStaffRole();

  const category = await server.createChannel(`${icon} ${name}`, {
    type: "category",
    permissionOverwrites: [
      { id: server.id, deny: "VIEW_CHANNEL" },
      { id: staff.id, allow: "VIEW_CHANNEL" },
      { id: role.id, allow: "VIEW_CHANNEL" }
    ]
  });

  server
    .createChannel(`annonces-${name}`, {
      type: "text"
    })
    .then(async channel => {
      await channel.setParent(category);
      await channel.lockPermissions();
    });

  server
    .createChannel(`general-${name}`, {
      type: "text"
    })
    .then(async channel => {
      await channel.setParent(category);
      await channel.lockPermissions();
    });

  server
    .createChannel(name, {
      type: "voice"
    })
    .then(async channel => {
      await channel.setParent(category);
      await channel.lockPermissions();
    });
};

export default createFactionChannels;
