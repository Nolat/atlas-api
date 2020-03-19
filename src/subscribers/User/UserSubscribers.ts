import { EventSubscriber, EntitySubscriberInterface } from "typeorm";

// * Entities
import { User } from "entities";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

// * Utils
import { sendFactionsMessage } from "utils/discord/helpers/sendFactionsMessage";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterUpdate() {
    const server = getDiscordGuild();
    if (!server) throw new Error("Discord Guild is not defined!");

    sendFactionsMessage(server);
  }
}
