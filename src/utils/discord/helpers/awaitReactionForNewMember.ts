import {
  Guild,
  TextChannel,
  Message,
  Role,
  User,
  Emoji,
  MessageReaction,
  GuildMember
} from "discord.js";

// * Entities
import { ServerMessage } from "entities";

export const awaitReactionForNewMember = async (server: Guild) => {
  const newMembers = server.members.filter(
    member => !member.roles.find(role => role.name !== "@everyone")
  );

  newMembers.forEach(member => awaitReactionAsNewMember(server, member));
};

export const awaitReactionAsNewMember = async (
  server: Guild,
  member: GuildMember
) => {
  const serverMessage = await ServerMessage.findOne({
    where: { type: "Accueil" }
  });

  if (!serverMessage) {
    throw new Error("Cannot find accueil serverMessage");
  }

  const yesEmoji: Emoji = server.emojis.find(emoji => emoji.name === "yes");

  const roleJoueur: Role = server.roles.find(role =>
    role.name.includes("Joueur")
  );

  const accueilChannel: TextChannel = server.channels.find(
    channel => channel.id === serverMessage.idChannel && channel.type === "text"
  ) as TextChannel;

  const accueilMessage: Message = await accueilChannel.fetchMessage(
    serverMessage.idMessage
  );

  const filter = (reaction: MessageReaction, user: User) => {
    return reaction.emoji === yesEmoji && user.id === member.user.id;
  };

  accueilMessage.awaitReactions(filter, { max: 1 }).then(() => {
    member.addRole(roleJoueur);

    const joinleaveChannel: TextChannel = server.channels.find(
      channel => channel.name.includes("join-leave") && channel.type === "text"
    ) as TextChannel;

    joinleaveChannel.send(`${member.user.toString()} est devenu Joueur.`);

    const generalChannel: TextChannel = server.channels.find(
      channel => channel.name.includes("general") && channel.type === "text"
    ) as TextChannel;

    generalChannel.send(
      `Un nouveau joueur vient d'apparaitre. Bienvenue à toi ${member.user.toString()}.`
    );
  });
};
