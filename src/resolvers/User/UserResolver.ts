import { ApolloError, UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { User, Faction } from "entities";

// * Helpers
import getUser from "./helpers/getUser";

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
  async setFaction(
    @Arg("id") id: string,
    @Arg("nameFaction") nameFaction: string
  ) {
    const user = await getUser(id);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    if (!user.faction)
      throw new ApolloError(
        `User : ${user.username} is in a faction`,
        "MEMBER_ALREADY_IN_FACTION"
      );

    const faction = await Faction.findOne({ where: { name: nameFaction } });

    if (!faction)
      throw new UserInputError(
        `Cannont find faction with name : ${nameFaction}`
      );

    user.faction = faction;

    return user.save();
  }
}
