import { EventSubscriber, EntitySubscriberInterface } from "typeorm";
import { Guild } from "discord.js";

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
    const server: Guild = getDiscordGuild()!;
    sendFactionsMessage(server);
  }
}
