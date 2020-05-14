import { ApolloError } from "apollo-server-express";

// * Entity
import { User, UserTitle } from "../../../entities";

const unsetUserTitle = async (id: string) => {
  const user: User | undefined = await User.findOne({ where: { id } });

  if (!user)
    throw new ApolloError(
      `Cannot find user with id : ${id}`,
      "USER_DOESNT_EXIST"
    );

  const userTitle: UserTitle | undefined = await UserTitle.findOne({
    relations: ["user", "title"],
    where: {
      user,
      isEnabled: true
    }
  });

  if (!userTitle)
    throw new ApolloError(
      `The user ${id} doesn't have any title set`,
      "USER_DOESNT_HAVE_TITLE"
    );

  userTitle.isEnabled = false;

  return userTitle.save();
};

export default unsetUserTitle;
