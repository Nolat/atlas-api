import { Guild, Message, RichEmbed, TextChannel, Emoji } from "discord.js";

// * Entities
import { ServerMessage } from "entities";

const sendAccueilMessage = async (server: Guild) => {
  let accueilChannel: TextChannel;
  let accueilMessage: Message;

  const factionsChannel = server.channels.find(
    channel => channel.name.includes("factions") && channel.type === "text"
  ) as TextChannel;

  const embed = new RichEmbed();

  embed
    .setColor("#f9ca24")
    .setTitle("👋 Bienvenue")
    .setDescription(
      "Bienvenue cher joueur/joueuse sur Edell, un monde virtuel occupé par 3 factions en guerre, " +
        `défendant chacun leurs idéaux. (Plus d’informations dans ${factionsChannel.toString()}).` +
        "\n\nEdell est un monde particulier, où de nombreux univers se retrouvent. Ainsi, les factions " +
        "s’affrontent dans divers mondes allant d’Overwatch à Counter-Strike en passant par Minecraft et " +
        "bien d’autres…" +
        "\n\nSoit guidé(e) par Atlas, une IA créée pour vous guider dans ce monde, et rejoins ta faction " +
        "pour prendre part au conflit sur Edell." +
        "\n\n\n\n➡️ **Pour continuer, merci de cliquer sur la réaction ci-dessous.**"
    );

  let serverMessage = await ServerMessage.findOne({
    where: { type: "Accueil" }
  });

  if (!serverMessage) {
    serverMessage = new ServerMessage();

    accueilChannel = server.channels.find(
      channel => channel.name.includes("accueil") && channel.type === "text"
    ) as TextChannel;

    accueilMessage = (await accueilChannel.send({ embed })) as Message;

    serverMessage.idChannel = accueilChannel.id;
    serverMessage.idMessage = accueilMessage.id;
    serverMessage.type = "Accueil";
    await serverMessage.save();
  } else {
    accueilChannel = server.channels.find(
      channel =>
        channel.id === serverMessage?.idChannel && channel.type === "text"
    ) as TextChannel;

    try {
      accueilMessage = await accueilChannel.fetchMessage(
        serverMessage.idMessage
      );
      accueilMessage = await accueilMessage.edit({ embed });
    } catch (error) {
      accueilMessage = (await accueilChannel.send({ embed })) as Message;

      serverMessage.idMessage = accueilMessage.id;
      await serverMessage.save();
    }

    const yesEmoji: Emoji = server.emojis.find(emoji => emoji.name === "yes");

    if (yesEmoji) {
      accueilMessage.react(yesEmoji);
    }
  }
};

export default sendAccueilMessage;
