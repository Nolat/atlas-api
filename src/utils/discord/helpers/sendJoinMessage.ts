import { Guild, GuildMember, TextChannel } from "discord.js";

const sendJoinMessage = async (server: Guild, member: GuildMember) => {
  const joinleaveChannel: TextChannel = server.channels.find(
    channel => channel.name.includes("join-leave") && channel.type === "text"
  ) as TextChannel;

  joinleaveChannel.send(`${member.user.toString()} a rejoint le serveur.`);
};

export default sendJoinMessage;
