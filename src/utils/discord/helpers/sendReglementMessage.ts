import { Guild } from "discord.js";
import { Like, Not, In } from "typeorm";

// * Entities
import { ServerMessage } from "entities";

// * Helpers
import sendOrUpdateServerMessage from "./sendOrUpdateServerMessage";

const sendReglementMessage = async (server: Guild) => {
  const serverMessages = await ServerMessage.find({
    where: { type: Like("%!%") }
  });

  serverMessages.forEach(sm => sendOrUpdateServerMessage(server, sm.type));
};

export default sendReglementMessage;
