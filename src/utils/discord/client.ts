import { Discord, Client, On } from "@typeit/discord";

// * Environment variables
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;

@Discord
export default class DiscordClient {
  public static CLIENT: Client;

  static start() {
    this.CLIENT = new Client();

    this.CLIENT.silent = true;
    this.CLIENT.login(DISCORD_TOKEN);
  }

  @On("message")
  async onMessage() {
    console.log();
  }
}
