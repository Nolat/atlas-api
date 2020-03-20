import { ApolloError, UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";
import moment from "moment-timezone";

// * Entities
import { User, Faction } from "entities";

// * Helpers
import getUser from "./helpers/getUser";
import giveFactionRole from "./helpers/giveFactionRole";
import removeFactionRole from "./helpers/removeFactionRole";
import sendFactionLeaveMessage from "./helpers/sendFactionLeaveMessage";
import sendFactionJoinMessage from "./helpers/sendFactionJoinMessage";

@Resolver(() => User)
export default class UserResolver {
  @Authorized()
  @Query(() => [User])
  users() {
    return User.find({
      relations: [
        "faction",
        "titles",
        "titles.title",
        "titles.title.branch",
        "titles.title.faction"
      ]
    });
  }

  @Authorized()
  @Query(() => User)
  async user(@Arg("id") id: string) {
    const user = await getUser(id, [
      "faction",
      "titles",
      "titles.title",
      "titles.title.branch",
      "titles.title.faction"
    ]);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async setUserFaction(
    @Arg("id") id: string,
    @Arg("factionName") factionName: string
  ) {
    const user = await getUser(id, ["faction"]);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    if (user.faction)
      throw new ApolloError(
        `User : ${user.username} is in a faction`,
        "MEMBER_ALREADY_IN_FACTION"
      );

    const faction = await Faction.findOne({ where: { name: factionName } });

    if (!faction)
      throw new UserInputError(
        `Cannot find faction with name : ${factionName}`
      );

    if (!(await faction.isJoinable()))
      throw new ApolloError(
        `Faction : ${factionName} is not joinable`,
        "FACTION_NOT_JOINABLE"
      );

    user.faction = faction;
    user.joinedFactionAt = moment().toISOString();

    giveFactionRole(id, factionName);
    sendFactionJoinMessage(id, faction);

    return user.save();
  }

  @Authorized()
  @Mutation(() => User)
  async unsetUserFaction(@Arg("id") id: string) {
    const user = await getUser(id, ["faction"]);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    if (!user.faction)
      throw new ApolloError(
        `User : ${user.username} doesn't have a faction`,
        "MEMBER_WITHOUT_FACTION"
      );

    removeFactionRole(id, user.faction.name);
    sendFactionLeaveMessage(id, user.faction);

    user.faction = null;
    user.joinedFactionAt = null;

    return user.save();
  }

  @Authorized()
  @Mutation(() => User)
  async giveUserMoney(@Arg("id") id: string, @Arg("money") money: number) {
    const user = await getUser(id);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);
    user.money += money;

    return user.save();
  }

  @Authorized()
  @Mutation(() => User)
  async removeUserMoney(@Arg("id") id: string, @Arg("amount") amount: number) {
    const user = await getUser(id);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);
    user.money = user.money >= amount ? user.money - amount : 0;

    return user.save();
  }
}
