import { UserInputError, ApolloError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { UserTitle, User, Title } from "entities";

@Resolver(() => UserTitle)
export default class UserTitleResolver {
  @Authorized()
  @Query(() => [UserTitle])
  async userTitles(
    @Arg("id", { nullable: true }) id: string,
    @Arg("factionName", { nullable: true }) factionName?: string
  ) {
    if (!id)
      return UserTitle.find({
        relations: [
          "user",
          "title",
          "title.branch",
          "title.faction",
          "title.parent"
        ]
      });

    if (!factionName)
      return UserTitle.find({
        relations: [
          "user",
          "title",
          "title.branch",
          "title.faction",
          "title.parent"
        ],
        where: { user: { id } }
      });

    return UserTitle.find({
      relations: [
        "user",
        "title",
        "title.branch",
        "title.faction",
        "title.parent"
      ],
      where: { user: { id }, faction: { name: factionName } }
    });
  }

  @Authorized()
  @Query(() => UserTitle)
  async userTitle(@Arg("id") id: string, @Arg("name") name: string) {
    const userTitle = await UserTitle.findOne({
      relations: [
        "user",
        "title",
        "title.branch",
        "title.faction",
        "title.parent"
      ],
      where: { title: { name }, user: { id } }
    });

    if (!userTitle)
      throw new UserInputError(
        `Cannot find userTitle with name : ${name} for user with id : ${id}`
      );

    return userTitle;
  }

  @Authorized()
  @Mutation(() => UserTitle)
  async addUserTitle(@Arg("id") id: string, @Arg("name") name: string) {
    const userTitleWithSameName = await UserTitle.findOne({
      where: { title: { name }, user: { id } }
    });

    if (userTitleWithSameName)
      throw new ApolloError(
        `A user title already exist with name:  ${name} for user with id : ${id}`,
        "USERTITLE_ALREADY_EXIST"
      );

    const user = await User.findOne({
      where: { id }
    });

    if (!user)
      throw new ApolloError(
        `Cannot find user with id : ${id}`,
        "USER_DOESNT_EXIST"
      );

    const title = await Title.findOne({
      where: { name },
      relations: ["parent"]
    });

    if (!title)
      throw new ApolloError(
        `Cannot find title with name : ${name}`,
        "TITLE_DOESNT_EXIST"
      );

    if (title.parent) {
      const parentUserTitle = await UserTitle.findOne({
        where: { title: title.parent, user }
      });

      if (!parentUserTitle)
        throw new ApolloError(
          `Cannot add title : ${name} to user (${id}) as he doesn't have his parent`,
          "USER_DOESNT_HAVE_PARENT"
        );
    }

    const userTitle = new UserTitle();
    userTitle.user = user;
    userTitle.title = title;
    return userTitle.save();
  }
}
