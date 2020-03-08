import { TextChannel } from "discord.js";

// * Entities
import { ServerMessage } from "entities";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionMessage = async (message: ServerMessage) => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  const factionsChannel = server.channels.find(
    channel => channel.id === message.idChannel && channel.type === "text"
  ) as TextChannel;

  if (!message.idMessage)
    throw new Error("Faction ServerMessage has no message id");

  try {
    const factionMessage = await factionsChannel.fetchMessage(
      message.idMessage
    );
    factionMessage.delete();
  } catch (error) {
    console.log(error);
  }
};

export default deleteFactionMessage;
