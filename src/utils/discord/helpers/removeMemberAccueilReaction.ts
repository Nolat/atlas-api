import { Guild, GuildMember, TextChannel, Message } from "discord.js";

// * Entities
import { ServerMessage } from "entities";

const removeMemberAccueilReaction = async (
  server: Guild,
  member: GuildMember
) => {
  const serverMessage = await ServerMessage.findOne({
    where: { type: "Accueil" }
  });

  if (!serverMessage) throw new Error("Cannot find accueil serverMessage");

  const accueilChannel: TextChannel = server.channels.find(
    channel => channel.id === serverMessage.idChannel && channel.type === "text"
  ) as TextChannel;

  if (!serverMessage.idMessage)
    throw new Error("Accueil ServerMessage don't have message id");

  const accueilMessage: Message = await accueilChannel.fetchMessage(
    serverMessage.idMessage
  );

  accueilMessage.reactions.forEach(reaction => reaction.remove(member.id));
};

export default removeMemberAccueilReaction;
