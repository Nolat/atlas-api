import { GuildMember, Guild, TextChannel, RichEmbed } from "discord.js";

// * Entities
import { Faction } from "entities";

// * Utils
import getDiscordGuild from "helpers/discord/getDiscordGuild";
import getMemberById from "helpers/discord/getMemberById";

const sendFactionJoinMessage = async (id: string, faction: Faction) => {
  const server: Guild = getDiscordGuild()!;
  const member: GuildMember = getMemberById(id);
  const channel: TextChannel = server.channels.find(
    c =>
      c.name.includes("annonces") &&
      c.name.includes(faction.name.toLowerCase()) &&
      c.type === "text"
  ) as TextChannel;

  const embed = new RichEmbed()
    .setColor(faction.color)
    .setTitle(`${faction.icon} Nouveau membre !`)
    .setDescription(`Bienvenue à toi ${member.toString()}!`);

  channel.send({ embed });
};

export default sendFactionJoinMessage;
