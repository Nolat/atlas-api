import { Guild } from "discord.js";

// * Helpers
import sendOrUpdateServerMessage from "./sendOrUpdateServerMessage";

const sendReglementMessage = async (server: Guild) => {
  sendOrUpdateServerMessage(server, "#reglement");
  sendOrUpdateServerMessage(server, "#overwatch-3v3");
  sendOrUpdateServerMessage(server, "#overwatch-6v6");
  sendOrUpdateServerMessage(server, "#counter-strike-2v2");
  sendOrUpdateServerMessage(server, "#counter-strike-5v5");
  sendOrUpdateServerMessage(server, "#league-of-legends-5v5");
  sendOrUpdateServerMessage(server, "#super-smash-bros-1v1");
  sendOrUpdateServerMessage(server, "#super-smash-bros-2v2");
};

export default sendReglementMessage;
