// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

const deleteFactionChannels = (name: string) => {
  const server = getDiscordGuild();
  if (!server) throw new Error("Discord Guild is not defined!");

  const channels = server.channels.filter(channel =>
    channel.name.toLowerCase().includes(name.toLowerCase())
  );

  channels.forEach(channel => channel.delete());
};

export default deleteFactionChannels;
