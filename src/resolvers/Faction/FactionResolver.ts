import { UserInputError, ApolloError } from "apollo-server-express";
import { Role } from "discord.js";
import {
  Authorized,
  Query,
  Resolver,
  Arg,
  Mutation,
  Subscription
} from "type-graphql";

// * Entities
import { Faction } from "entities";

// * Helpers
import createFactionRoles from "./helpers/createFactionRoles";
import createFactionChannels from "./helpers/createFactionChannels";

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
    const faction = await Faction.find({ where: { name } });

    if (!faction)
      throw new UserInputError(`Cannot find faction with name : ${name}`);

    return faction;
  }

  @Subscription(() => [Faction], { topics: "FACTION_DESCRIPTION_UPDATE" })
  factionDescriptionUpdate() {
    return Faction.find();
  }

  @Authorized()
  @Mutation(() => Faction)
  async createFaction(
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

    return faction;
  }
}
