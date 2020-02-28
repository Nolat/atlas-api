import { UserInputError, ApolloError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { Title, Faction, TitleBranch } from "entities";

@Resolver(() => Title)
export default class TitleResolver {
  @Authorized()
  @Query(() => [Title])
  async titles(
    @Arg("factionName", { nullable: true }) factionName: string,
    @Arg("branchName", { nullable: true }) branchName: string
  ) {
    if (factionName) {
      const faction = await Faction.findOne({ where: { name: factionName } });
      if (!faction)
        throw new ApolloError(
          `Cannot find faction: ${factionName}`,
          "CANNOT_FIND_FACTION"
        );

      if (branchName) {
        const branch = await TitleBranch.findOne({
          where: { name: branchName }
        });

        if (!branch)
          throw new ApolloError(
            `Cannot find branch: ${branchName}`,
            "CANNOT_FIND_BRANCH"
          );

        return Title.find({
          where: { faction, branch },
          relations: ["parent", "branch", "faction"]
        });
      }

      return Title.find({
        where: { faction },
        relations: ["parent", "branch", "faction"]
      });
    }

    return Title.find({
      relations: ["parent", "branch", "faction"]
    });
  }

  @Authorized()
  @Query(() => Title)
  async title(@Arg("name") name: string) {
    const title = await Title.findOne({
      where: { name },
      relations: ["parent", "branch", "faction"]
    });

    if (!title)
      throw new UserInputError(`Cannot find title with name : ${name}`);

    return title;
  }

  @Authorized()
  @Mutation(() => Title)
  async addTitle(
    @Arg("name") name: string,
    @Arg("level", { nullable: true }) level: number,
    @Arg("factionName", { nullable: true }) factionName: string,
    @Arg("branchName", { nullable: true }) branchName: string,
    @Arg("parentName", { nullable: true }) parentName: string
  ) {
    const titleWithSameName = await Title.findOne({ where: { name } });

    if (titleWithSameName)
      throw new ApolloError(
        `A title already exist with name:  ${name}`,
        "TITLE_NAME_UNAVAILABLE"
      );

    let faction;
    if (factionName) {
      faction = await Faction.findOne({ where: { name: factionName } });
      if (!faction)
        throw new ApolloError(
          `Cannot find faction: ${factionName}`,
          "CANNOT_FIND_FACTION"
        );
    }

    let branch;
    if (branchName) {
      branch = await TitleBranch.findOne({ where: { name: branchName } });
      if (!branch)
        throw new ApolloError(
          `Cannot find branch: ${branchName}`,
          "CANNOT_FIND_BRANCH"
        );
    }

    let parent;
    if (parentName) {
      parent = await Title.findOne({ where: { name: parentName } });
      if (!parent)
        throw new UserInputError(
          `Cannot find parent with name : ${parentName}`
        );
    }

    const title = new Title();
    title.name = name;
    title.level = level;
    if (faction) title.faction = faction;
    if (branch) title.branch = branch;
    if (parent) title.parent = parent;

    return title.save();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeTitle(@Arg("name") name: string) {
    const title = await Title.findOne({
      where: { name }
    });

    if (!title)
      throw new ApolloError(
        `Cannot find title whit name: ${name}`,
        "CANNOT_FIND_TITLE"
      );

    Title.remove(title);

    return true;
  }
}
