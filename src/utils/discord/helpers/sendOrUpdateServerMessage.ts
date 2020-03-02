import { Message, RichEmbed, TextChannel, Guild } from "discord.js";

// * Entities
import { ServerMessage, MessageDescription } from "entities";

const sendOrUpdateServerMessage = async (
  server: Guild,
  type: string,
  color?: string
) => {
  const embed = new RichEmbed();
  if (color) embed.setColor(color);
  else embed.setColor("#f9ca24");

  const serverMessage = await ServerMessage.findOne({
    where: { type }
  });

  if (!serverMessage) throw new Error(`Cannot find serverMessage for ${type}`);

  const messageDescriptions = await MessageDescription.find({
    where: { serverMessage },
    order: { order: "ASC" }
  });

  messageDescriptions.forEach(md => {
    if (md.title && !md.description) embed.setTitle(md.title);
    else if (!md.title && md.description) embed.setDescription(md.description);
    else embed.addField(md.title, md.description);
  });

  // ! Ajout du salon #factions dans le message d'Accueil
  if (type === "#accueil") {
    const factionsChannel = server.channels.find(
      channel => channel.name.includes("factions") && channel.type === "text"
    ) as TextChannel;

    embed.setDescription(
      embed.description?.replace("FACTION_CHANNEL", factionsChannel.toString())
    );
  }

  const channel = server.channels.find(
    c => c.id === serverMessage.idChannel && c.type === "text"
  ) as TextChannel;

  let message;
  if (serverMessage.idMessage) {
    try {
      message = await channel.fetchMessage(serverMessage.idMessage);
      message = await message.edit({ embed });
    } catch (error) {
      message = (await channel.send({ embed })) as Message;

      serverMessage.idMessage = message.id;
      await serverMessage.save();
    }
  } else {
    message = (await channel.send({ embed })) as Message;

    serverMessage.idMessage = message.id;
    await serverMessage.save();
  }

  return message;
};

export default sendOrUpdateServerMessage;
