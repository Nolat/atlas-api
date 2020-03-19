import { EventSubscriber, EntitySubscriberInterface } from "typeorm";

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
    const server = getDiscordGuild();
    if (!server) throw new Error("Discord Guild is not defined!");

    sendFactionsMessage(server);
  }
}
