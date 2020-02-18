import { ApolloError, UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { User } from "entities";

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
  async unsetFaction(@Arg("id") id: string) {
    const user = await getUser(id, ["faction"]);
    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    if (!user.faction)
      throw new ApolloError(
        "User doesn't have a faction",
        "MEMBER_WITHOUT_FACTION"
      );

    await user.faction.remove();

    return user.save();
  }
}
