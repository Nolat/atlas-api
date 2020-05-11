import { UserInputError, ApolloError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";
import { ObjectLiteral } from "typeorm";

// * Entities
import { UserTitle, User, Title } from "entities";
import getUser from "../User/helpers/getUser";

@Resolver(() => UserTitle)
export default class UserTitleResolver {
  @Authorized()
  @Query(() => [UserTitle])
  async userTitles(
    @Arg("id", { nullable: true }) id?: string,
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
      where: (qb: ObjectLiteral) => {
        qb.where({
          user: { id }
        }).andWhere("UserTitle__title__faction.name = :factionName", {
          factionName
        });
      }
    });
  }

  @Authorized()
  @Query(() => UserTitle)
  async userTitle(@Arg("id") id: string, @Arg("name") name: string) {
    const title = await Title.findOne({ where: { name } });

    if (!title)
      throw new ApolloError(
        `Cannot find title with name : ${name}`,
        "TITLE_DOESNT_EXIST"
      );

    const userTitle = await UserTitle.findOne({
      relations: [
        "user",
        "title",
        "title.branch",
        "title.faction",
        "title.parent"
      ],
      where: { title, user: { id } }
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

  @Authorized()
  @Mutation(() => UserTitle)
  async setUserActiveTitle(
    @Arg("id") id: string,
    @Arg("title") titleName: string
  ) {
    const user = await getUser(id);

    if (!user) throw new UserInputError(`Cannot find user with id : ${id}`);

    const title = await Title.findOne({
      where: {
        name: titleName
      }
    });

    if (!title)
      throw new UserInputError(`Cannot find title with name : ${titleName}`);

    const userTitle: UserTitle | undefined = await UserTitle.findOne({
      where: { title, user: user.id }
    });

    if (!userTitle) throw new UserInputError(`User don't have unlock it YEET`);
    if (userTitle.isEnabled)
      throw new ApolloError("Title already set", "TITLE_ALREADY_SET");

    const titlesActivate: UserTitle[] | undefined = await UserTitle.find({
      where: { user: user.id, isEnabled: true }
    });

    await titlesActivate.forEach(titleActivated => {
      titleActivated.isEnabled = false;
      titleActivated.save();
    });

    userTitle.isEnabled = true;
    userTitle.user = user;

    return userTitle.save();
  }
}
