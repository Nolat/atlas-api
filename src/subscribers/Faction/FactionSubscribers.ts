import { EventSubscriber, EntitySubscriberInterface } from "typeorm";
import { Guild } from "discord.js";

// * Entities
import { Faction } from "entities";

// * Helpers
import getDiscordGuild from "helpers/discord/getDiscordGuild";

// * Utils
import { sendFactionsMessage } from "utils/discord/helpers/sendFactionsMessage";

@EventSubscriber()
export class FactionSubscriber implements EntitySubscriberInterface<Faction> {
  listenTo() {
    return Faction;
  }

  async afterUpdate() {
    const server: Guild = getDiscordGuild()!;
    sendFactionsMessage(server);
  }
}
