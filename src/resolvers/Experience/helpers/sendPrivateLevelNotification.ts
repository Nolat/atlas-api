import { RichEmbed } from "discord.js";

// * Helpers
import getMemberById from "helpers/discord/getMemberById";

const sendPrivateLevelNotification = async (
  id: string,
  faction: string,
  level: number
) => {
  const member = getMemberById(id);
  const embed = new RichEmbed();

  embed
    .setTitle("🎉 Félicitations !")
    .setColor("GREEN")
    .setDescription(
      `${member.user.toString()}, tu es passé au Niveau ${level} chez ${faction}.`
    );

  const dmChannel = await member.createDM();
  dmChannel.send(embed);
};

export default sendPrivateLevelNotification;
