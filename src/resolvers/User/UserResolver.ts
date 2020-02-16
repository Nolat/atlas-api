import { UserInputError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg } from "type-graphql";

// * Entities
import { User } from "entities";

// * Utils
import getUser from "helpers/user/getUser";

@Resolver(() => User)
export default class UserResolver {
  @Authorized()
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Authorized()
  @Query(() => User)
  async user(@Arg("id") id: string) {
    const user = await getUser(id);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    return user;
  }
}
