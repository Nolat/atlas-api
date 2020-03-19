import { UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { Experience, Faction, User } from "entities";

// * Helpers
import getUser from "resolvers/User/helpers/getUser";

// * Experience helpers
import getXPByLevel from "./helpers/getXPByLevel";
import sendPrivateLevelNotification from "./helpers/sendPrivateLevelNotification";

@Resolver(() => Experience)
export default class ExperienceResolver {
  @Authorized()
  @Query(() => [Experience])
  async experiences(@Arg("id", { nullable: true }) id?: string) {
    if (id) {
      const user = await User.findOne({ where: { id } });

      if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

      return Experience.find({
        where: { user },
        relations: ["faction", "user"]
      });
    }
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
  @Mutation(() => Experience)
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

    let experience = await Experience.findOne({
      where: { faction, user }
    });

    if (!experience) {
      experience = new Experience();
      experience.user = user;
      experience.faction = faction;
    }

    let restAmount = amount;
    let newValue = experience.value + restAmount || restAmount;
    let newLevel = experience.level || 0;
    let nextLimit = getXPByLevel((experience.level || 0) + 1);

    while (newValue >= nextLimit) {
      newLevel += 1;
      restAmount -= nextLimit;
      newValue = experience.value + restAmount || restAmount;
      nextLimit = getXPByLevel(newLevel + 1);
    }

    if (experience.level !== newLevel && newLevel !== 0)
      sendPrivateLevelNotification(user.id, faction.name, newLevel);

    experience.value = newValue;
    experience.level = newLevel;

    return experience.save();
  }

  @Authorized()
  @Mutation(() => Experience)
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

    let experience = await Experience.findOne({
      where: { faction, user }
    });

    if (!experience) {
      experience = new Experience();
      experience.user = user;
      experience.faction = faction;
    }

    let restAmount = amount;
    let actualValue = experience.value || 0;
    let newLevel = experience.level || 0;

    while (restAmount > actualValue) {
      if (newLevel <= 0) break;
      newLevel -= 1;
      restAmount -= actualValue;
      actualValue = getXPByLevel(newLevel + 1);
    }

    experience.value = restAmount > actualValue ? 0 : actualValue - restAmount;
    experience.level = newLevel;

    return experience.save();
  }
}
