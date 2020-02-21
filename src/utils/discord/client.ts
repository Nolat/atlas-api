import { Discord, Client, On } from "@typeit/discord";
import { Guild, GuildMember } from "discord.js";

// * Helpers
import {
  awaitReactionForNewMember,
  awaitReactionAsNewMember
} from "./helpers/awaitReactionForNewMember";
import removeMemberAccueilReaction from "./helpers/removeMemberAccueilReaction";
import sendAccueilMessage from "./helpers/sendAccueilMessage";
import sendJoinMessage from "./helpers/sendJoinMessage";
import sendLeaveMessage from "./helpers/sendLeaveMessage";
import sendReglementMessage from "./helpers/sendReglementMessage";
import { sendFactionsMessage } from "./helpers/sendFactionsMessage";

// * Environment variables
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;
const DISCORD_SERVER_ID: string = process.env.DISCORD_SERVER_ID!;

@Discord
export default class DiscordClient {
  public static CLIENT: Client;

  static start() {
    this.CLIENT = new Client();

    this.CLIENT.silent = true;
    this.CLIENT.login(DISCORD_TOKEN);
  }

  @On("ready")
  async onReady() {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === DISCORD_SERVER_ID
    );

    sendAccueilMessage(server);
    sendReglementMessage(server);
    sendFactionsMessage(server);
    awaitReactionForNewMember(server);
  }

  @On("guildMemberAdd")
  async onGuildMemberAdd(member: GuildMember) {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === DISCORD_SERVER_ID
    );

    sendJoinMessage(server, member);
    awaitReactionAsNewMember(server, member);
  }

  @On("guildMemberRemove")
  async onGuildMemberRemove(member: GuildMember) {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === DISCORD_SERVER_ID
    );

    sendLeaveMessage(server, member);
    removeMemberAccueilReaction(server, member);
  }
}
