import { UserInputError, ApolloError } from "apollo-server-express";
import { Authorized, Query, Resolver, Arg, Mutation } from "type-graphql";

// * Entities
import { TitleBranch, Faction } from "entities";

@Resolver(() => TitleBranch)
export default class TitleBranchResolver {
  @Authorized()
  @Query(() => [TitleBranch])
  async titleBranches(
    @Arg("factionName", { nullable: true }) factionName: string
  ) {
    if (factionName) {
      const faction = await Faction.findOne({ where: { name: factionName } });
      if (!faction)
        throw new ApolloError(
          `Cannot find faction: ${factionName}`,
          "CANNOT_FIND_FACTION"
        );

      return TitleBranch.find({
        where: { faction },
        relations: ["faction"]
      });
    }

    return TitleBranch.find({ relations: ["faction"] });
  }

  @Authorized()
  @Query(() => TitleBranch)
  async titleBranch(@Arg("name") name: string) {
    const titleBranch = await TitleBranch.findOne({ where: { name } });

    if (!titleBranch)
      throw new UserInputError(`Cannot find branch with name : ${name}`);

    return titleBranch;
  }

  @Authorized()
  @Mutation(() => TitleBranch)
  async addTitleBranch(
    @Arg("name") name: string,
    @Arg("factionName") factionName: string
  ) {
    const titleBrachWithSameName = await TitleBranch.findOne({
      where: { name }
    });

    if (titleBrachWithSameName)
      throw new ApolloError(
        `A branch already exist with name:  ${name}`,
        "BRANCH_NAME_UNAVAILABLE"
      );

    const faction = await Faction.findOne({ where: { name: factionName } });
    if (!faction)
      throw new ApolloError(
        `Cannot find faction: ${factionName}`,
        "CANNOT_FIND_FACTION"
      );

    const branch = new TitleBranch();
    branch.name = name;
    branch.faction = faction;

    return branch.save();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeTitleBranch(@Arg("name") name: string) {
    const branch = await TitleBranch.findOne({
      where: { name }
    });

    if (!branch)
      throw new ApolloError(
        `Cannot find brach with name: ${name}`,
        "CANNOT_FIND_BRANCH"
      );

    TitleBranch.remove(branch);

    return true;
  }
}
