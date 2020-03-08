import { Message, RichEmbed, TextChannel, Guild } from "discord.js";

// * Entities
import { ServerMessage, MessageDescription } from "entities";

const sendOrUpdateServerMessage = async (
  server: Guild,
  type: string,
  color?: string
): Promise<Message> => {
  const embed = await buildEmbedMessage(server, type, color);
  return sendEmbed(server, type, embed);
};

const buildEmbedMessage = async (
  server: Guild,
  type: string,
  color?: string
): Promise<RichEmbed> => {
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

  addMessageDescriptionToEmbed(embed, messageDescriptions, server, type);

  // ! Ajout du salon #factions dans le message d'Accueil
  if (type === "#accueil") {
    const factionsChannel = server.channels.find(
      channel => channel.name.includes("factions") && channel.type === "text"
    ) as TextChannel;

    embed.setDescription(
      embed.description?.replace("FACTION_CHANNEL", `${factionsChannel}`)
    );
  }

  return embed;
};

const addMessageDescriptionToEmbed = (
  embed: RichEmbed,
  messageDescriptions: MessageDescription[],
  server: Guild,
  type: string
) => {
  messageDescriptions.forEach(md => {
    if (md.title && !md.description) embed.setTitle(md.title);
    else if (!md.title && md.description) embed.setDescription(md.description);
    else if (type === "#regles-conquetes") {
      const carteChannel = server.channels.find(
        channel => channel.name.includes("carte") && channel.type === "text"
      ) as TextChannel;

      if (!md.description)
        throw new Error("Carte MessageDescription don't have a description");

      embed.addField(
        md.title,
        md.description.replace("CARTE_CHANNEL", `${carteChannel}`)
      );
    } else embed.addField(md.title, md.description);
  });
  return embed;
};

const sendEmbed = async (server: Guild, type: string, embed: RichEmbed) => {
  const serverMessage = await ServerMessage.findOne({
    where: { type }
  });

  if (!serverMessage) throw new Error(`Cannot find serverMessage for ${type}`);
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
