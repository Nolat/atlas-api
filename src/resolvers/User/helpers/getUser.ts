// * Entity
import { User } from "entities";

// * Utils
import getMemberById from "helpers/discord/getMemberById";

const getUser = async (
  id: string,
  relations?: string[] | undefined
): Promise<User | undefined> => {
  let user: User | undefined = await User.findOne({
    where: { id },
    relations
  });

  if (user) return user;

  const guildMember = getMemberById(id);
  if (!guildMember) return undefined;

  user = new User();
  user.id = id;
  user.username = guildMember.nickname || guildMember.user.username;
  await user.save();

  return user;
};

export default getUser;
