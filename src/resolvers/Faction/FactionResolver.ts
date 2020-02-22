import { UserInputError, ApolloError } from "apollo-server-express";
import { Role } from "discord.js";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { Faction, ServerMessage } from "entities";

// * Utils
import { sendFactionMessage } from "utils/discord/helpers/sendFactionsMessage";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

import createFactionRoles from "./helpers/createFactionRoles";
import createFactionChannels from "./helpers/createFactionChannels";
import deleteFactionChannels from "./helpers/deleteFactionChannels";
import deleteFactionMessage from "./helpers/deleteFactionMessage";
import deleteFactionRoles from "./helpers/deleteFactionRoles";

@Resolver(() => Faction)
export default class FactionResolver {
  @Authorized()
  @Query(() => [Faction])
  factions() {
    return Faction.find();
  }

  @Authorized()
  @Query(() => Faction)
  async faction(@Arg("name") name: string) {
    const faction = await Faction.findOne({ where: { name } });

    if (!faction)
      throw new UserInputError(`Cannot find faction with name : ${name}`);

    return faction;
  }

  @Authorized()
  @Mutation(() => Faction)
  async addFaction(
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("color") color: string,
    @Arg("icon") icon: string
  ) {
    const factionWithSameName = await Faction.findOne({
      where: { name }
    });

    if (factionWithSameName)
      throw new ApolloError(
        `A faction already exist with name:  ${name}`,
        "FACTION_NAME_UNAVAILABLE"
      );

    const faction = new Faction();
    faction.name = name;
    faction.description = description;
    faction.color = color;
    faction.icon = icon;

    await faction.save();

    const role: Role = await createFactionRoles(name, color, icon);
    createFactionChannels(name, icon, role);

    const server = getDiscordGuild()!;
    sendFactionMessage(server, faction);

    return faction;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeFaction(@Arg("name") name: string) {
    const faction = await Faction.findOne({
      where: { name }
    });

    if (!faction)
      throw new ApolloError(
        `Cannot find faction: ${name}`,
        "CANNOT_FIND_FACTION"
      );

    deleteFactionChannels(name);
    deleteFactionRoles(name);

    Faction.remove(faction);

    const serverMessage = await ServerMessage.findOne({
      where: { type: name }
    });
    if (serverMessage) {
      deleteFactionMessage(serverMessage);
      ServerMessage.remove(serverMessage);
    }

    return true;
  }
}
