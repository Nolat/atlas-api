import { Guild } from "discord.js";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionChannels = (name: string) => {
  const server: Guild = getDiscordGuild()!;
  const channels = server.channels.filter(channel =>
    channel.name.toLowerCase().includes(name.toLowerCase())
  );

  channels.forEach(channel => channel.delete());
};

export default deleteFactionChannels;
