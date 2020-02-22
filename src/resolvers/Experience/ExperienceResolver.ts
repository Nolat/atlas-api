import { UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { Experience, Faction, User } from "entities";

// * Helpers
import getUser from "resolvers/User/helpers/getUser";

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

  @Authorized()
  @Mutation(() => User)
  async giveUserExperience(
    @Arg("id") id: string,
    @Arg("experience") amount: number,
    @Arg("factionName") factionName: string
  ) {
    const user = await getUser(id);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    const faction = await Faction.findOne({ where: { name: factionName } });

    if (!faction)
      throw new UserInputError(
        `Cannot find faction with name : ${factionName}`
      );

    const experience = await Experience.findOne({
      where: { faction: faction!, user: user! }
    });

    if (!experience) {
      const newExp: Experience = new Experience();
      newExp.user = user;
      newExp.faction = faction;
      newExp.value = amount;
      newExp.save();
    } else experience.value += amount;

    return user.save();
  }

  @Authorized()
  @Mutation(() => User)
  async removeUserExperience(
    @Arg("id") id: string,
    @Arg("experience") amount: number,
    @Arg("factionName") factionName: string
  ) {
    const user = await getUser(id);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    const faction = await Faction.findOne({ where: { name: factionName } });

    if (!faction)
      throw new UserInputError(
        `Cannot find faction with name : ${factionName}`
      );

    const experience = await Experience.findOne({
      where: { faction: faction!, user: user! }
    });

    if (!experience) {
      const newExp: Experience = new Experience();
      newExp.user = user;
      newExp.faction = faction;
      newExp.value = 0;
      newExp.save();
    } else
      experience.value =
        experience.value >= amount ? experience.value - amount : 0;

    return user.save();
  }
}
