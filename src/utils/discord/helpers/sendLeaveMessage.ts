import { Guild, GuildMember, TextChannel } from "discord.js";
import moment from "moment";

const sendLeaveMessage = async (server: Guild, member: GuildMember) => {
  const joinleaveChannel: TextChannel = server.channels.find(
    channel => channel.name.includes("join-leave") && channel.type === "text"
  ) as TextChannel;

  const months = moment().diff(member.joinedTimestamp, "months");
  const days = moment().diff(member.joinedTimestamp, "days");

  let message = `${member.user.toString()} a quitté le serveur.`;
  if (months > 0) {
    message += ` Il a été avec nous ${months} mois et ${days} jours.`;
  }

  joinleaveChannel.send(message);
};

export default sendLeaveMessage;
