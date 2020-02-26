import { Guild, Emoji } from "discord.js";

// * Helpers
import sendOrUpdateServerMessage from "./sendOrUpdateServerMessage";

const sendAccueilMessage = async (server: Guild) => {
  const message = await sendOrUpdateServerMessage(server, "#accueil");

  const yesEmoji: Emoji = server.emojis.find(emoji => emoji.name === "yes");

  if (yesEmoji) message.react(yesEmoji);
};

export default sendAccueilMessage;
