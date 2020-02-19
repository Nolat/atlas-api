import { ApolloError, UserInputError } from "apollo-server-express";
import {
  Authorized,
  Query,
  Resolver,
  Arg,
  Mutation,
  PubSub,
  Publisher
} from "type-graphql";
import moment from "moment-timezone";

// * Entities
import { User, Faction } from "entities";

// * Helpers
import getUser from "./helpers/getUser";
import giveFactionRole from "./helpers/giveFactionRole";
import removeFactionRole from "./helpers/removeFactionRole";

@Resolver(() => User)
export default class UserResolver {
  @Authorized()
  @Query(() => [User])
  users() {
    return User.find({ relations: ["faction"] });
  }

  @Authorized()
  @Query(() => User)
  async user(@Arg("id") id: string) {
    const user = await getUser(id, ["faction"]);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async setUserFaction(
    @Arg("id") id: string,
    @Arg("factionName") factionName: string,
    @PubSub("FACTION_DESCRIPTION_UPDATE") publish: Publisher<void>
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

    user.faction = faction;
    user.joinedFactionAt = moment().toISOString();

    giveFactionRole(id, factionName);
    await publish();

    return user.save();
  }

  @Authorized()
  @Mutation(() => User)
  async unsetUserFaction(
    @Arg("id") id: string,
    @PubSub("FACTION_DESCRIPTION_UPDATE") publish: Publisher<void>
  ) {
    const user = await getUser(id, ["faction"]);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    if (!user.faction)
      throw new ApolloError(
        `User : ${user.username} doesn't have a faction`,
        "MEMBER_WITHOUT_FACTION"
      );

    removeFactionRole(id, user.faction.name);

    user.faction = null;
    user.joinedFactionAt = null;

    await publish();

    return user.save();
  }
}
