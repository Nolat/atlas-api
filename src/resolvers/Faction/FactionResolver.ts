import { UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg } from "type-graphql";

// * Entities
import { Faction } from "entities";

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
}
