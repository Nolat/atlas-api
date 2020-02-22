import { UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg } from "type-graphql";

// * Entities
import { Experience, Faction, User } from "entities";

@Resolver(() => Experience)
export default class UserResolver {
  @Authorized()
  @Query(() => [Experience])
  experiences() {
    return Experience.find({ relations: ["faction", "user"] });
  }

  @Authorized()
  @Query(() => Experience)
  async experience(
    @Arg("id") id: string,
    @Arg("factionName") factionName: string
  ) {
    const user = await User.findOne({ where: id });

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    const faction = await Faction.findOne({ where: { name: factionName } });

    if (!faction)
      throw new UserInputError(
        `Cannot find faction with name : ${factionName}`
      );

    const experience = await Experience.findOne({
      where: {},
      relations: ["faction", "user"]
    });

    if (!experience)
      throw new UserInputError(
        `Cannot find experience with id : ${id} & factionName : ${factionName}`
      );

    return experience;
  }
}
