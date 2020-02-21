import { Guild, Message, RichEmbed, TextChannel } from "discord.js";

// * Entities
import { ServerMessage } from "entities";

const sendReglementMessage = async (server: Guild) => {
  let reglementChannel: TextChannel;
  let reglementMessage: Message;

  const embed = new RichEmbed();

  embed
    .setColor("#f9ca24")
    .setTitle("Règlement")
    .addField(
      "Règle n°1 - Vie de la communauté",
      "Les propos injurieux, racistes, sexistes, discriminatoires et à caractères pornographiques sont interdits. Les messages politiques ou religieux sont également à éviter."
    )
    .addField(
      "Règle n°2 - Comportement des membres",
      "Toute plaisanterie trop insistante sera sanctionnée. Le spam/flood de messages est interdit."
    )
    .addField(
      "Règle n°3 - Pseudos & Images de profils",
      "Le Staff se laisse la liberté de modifier les pseudos de certains membres dans différents cas (obscénité, caractères spéciaux, etc.). Il est bien sûr interdit de se faire passer pour un autre individu, Staff ou non.\n\nDe même, les images de profils à caractère obscène sont interdites et pourront faire l'objet d'une sanction."
    )
    .addField(
      "Règle n°4 - Ventes",
      "Edell n'est pas un site de vente ou d'enchères, la vente de comptes et autre est donc interdite."
    )
    .addField(
      "Règle n°5 - Promotions",
      "Toute demande de promotion sera ignorée. Les promotions se font au mérite et uniquement sur décision du Staff."
    )
    .addField(
      "Règle n°6 - Publicité/Recrutement",
      "Le recrutement et la publicité pour d'autres structures et serveurs sont strictement interdites."
    )
    .addField(
      "Règle n°7 - Liens/Fichiers",
      "Il est interdit de poster des liens/fichiers malveillants ou de screamers. Edell ne se tiens pas responsable en cas de téléchargement de fichier malveillant depuis le serveur Discord."
    )
    .addField(
      "Règle n°8 - Sanctions",
      "Toute sanction est donnée avec un motif. Vous pouvez évidemment contester la décision en envoyant une demande, le Staff se penchera alors plus en détails sur votre cas."
    )
    .addField(
      "Règle n°9 - Politesse",
      "Ni un **bonjour**, ni un **au revoir**, n'ont jamais tué personne. Nous vous demandons donc de faire preuve d'un minimum de politesse."
    );

  let serverMessage = await ServerMessage.findOne({
    where: { type: "Reglement" }
  });

  if (!serverMessage) {
    serverMessage = new ServerMessage();

    reglementChannel = server.channels.find(
      channel => channel.name.includes("reglement") && channel.type === "text"
    ) as TextChannel;

    reglementMessage = (await reglementChannel.send({ embed })) as Message;

    serverMessage.idChannel = reglementChannel.id;
    serverMessage.idMessage = reglementMessage.id;
    serverMessage.type = "Reglement";
    await serverMessage.save();
  } else {
    reglementChannel = server.channels.find(
      channel =>
        channel.id === serverMessage?.idChannel && channel.type === "text"
    ) as TextChannel;

    try {
      reglementMessage = await reglementChannel.fetchMessage(
        serverMessage.idMessage
      );
      reglementMessage = await reglementMessage.edit({ embed });
    } catch (error) {
      reglementMessage = (await reglementChannel.send({ embed })) as Message;

      serverMessage.idMessage = reglementMessage.id;
      await serverMessage.save();
    }
  }
};

export default sendReglementMessage;
