import { Guild, Message, RichEmbed, TextChannel } from "discord.js";

// * Entities
import { Faction, ServerMessage } from "entities";

export const sendFactionsMessage = async (server: Guild) => {
  const factions = await Faction.find();
  factions.forEach(faction => sendFactionMessage(server, faction));
};

export const sendFactionMessage = async (server: Guild, faction: Faction) => {
  let factionsChannel: TextChannel;
  let factionMessage: Message;

  const { name, description, color, icon, maxMember, isJoinable } = faction;

  const canJoinMessage: string = isJoinable
    ? `Vous pouvez rejoindre cette faction en utilisant la commande _join.`
    : "Cette faction est fermée pour le moment.";

  const embed = new RichEmbed();
  embed
    .setColor(color)
    .setTitle(`${icon} ${name}`)
    .setDescription(description)
    .addField("Membres", `${await faction.memberCount()}/${maxMember} membres`)
    .addField("Informations supplémentaires", canJoinMessage);

  let serverMessage = await ServerMessage.findOne({
    where: { type: faction.name }
  });

  if (!serverMessage) {
    serverMessage = new ServerMessage();

    factionsChannel = server.channels.find(
      channel => channel.name.includes("factions") && channel.type === "text"
    ) as TextChannel;

    factionMessage = (await factionsChannel.send({ embed })) as Message;

    serverMessage.idChannel = factionsChannel.id;
    serverMessage.idMessage = factionMessage.id;
    serverMessage.type = name;
    await serverMessage.save();
  } else {
    factionsChannel = server.channels.find(
      channel =>
        channel.id === serverMessage?.idChannel && channel.type === "text"
    ) as TextChannel;

    try {
      factionMessage = await factionsChannel.fetchMessage(
        serverMessage.idMessage!
      );
      factionMessage = await factionMessage.edit({ embed });
    } catch (error) {
      factionMessage = (await factionsChannel.send({ embed })) as Message;

      serverMessage.idMessage = factionMessage.id;
      await serverMessage.save();
    }
  }
};
