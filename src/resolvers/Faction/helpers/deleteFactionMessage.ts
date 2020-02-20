import { Guild, TextChannel } from "discord.js";

// * Entities
import { ServerMessage } from "entities";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionRoles = async (message: ServerMessage) => {
  const server: Guild = getDiscordGuild()!;
  const factionsChannel = server.channels.find(
    channel => channel.id === message.idChannel && channel.type === "text"
  ) as TextChannel;

  try {
    const factionMessage = await factionsChannel.fetchMessage(
      message.idMessage
    );
    factionMessage.delete();
  } catch (error) {
    console.log(error);
  }
};

export default deleteFactionRoles;
