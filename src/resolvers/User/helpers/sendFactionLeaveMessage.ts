import { GuildMember, Guild, TextChannel, RichEmbed } from "discord.js";

// * Entities
import { Faction } from "entities";

// * Utils
import getDiscordGuild from "helpers/discord/getDiscordGuild";
import getMemberById from "helpers/discord/getMemberById";

const sendFactionLeaveMessage = async (id: string, faction: Faction) => {
  const server: Guild = getDiscordGuild()!;
  const member: GuildMember = getMemberById(id);
  const channel: TextChannel = server.channels.find(
    c =>
      c.name.includes("annonces") &&
      c.name.includes(
        faction.name
          .toLowerCase()
          .split(" ")
          .join("-")
      ) &&
      c.type === "text"
  ) as TextChannel;

  const embed = new RichEmbed()
    .setColor("RED")
    .setTitle(`${faction.icon} Départ d'un membre`)
    .setDescription(`${member.toString()} viens de vous quitter.`);

  channel.send({ embed });
};

export default sendFactionLeaveMessage;
