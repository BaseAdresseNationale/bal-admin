import { schedule } from "node-cron";
import * as EventService from "./service";
import { Event } from "./entity";
import { Participant } from "../participant/entity";
import { findManyByEvent } from "../participant/service";
import { sendParticipationEvenement } from "../mailer/service";
import { Logger } from "../../utils/logger.utils";

async function sendReminderEvents() {
  const today = new Date().toISOString().split("T")[0];
  const events: Event[] = await EventService.findMany({
    // date: today,
    // reminderSent: false,
  });
  for (const event of events) {
    const participants: Participant[] = await findManyByEvent(event.id);
    for (const participant of participants) {
      try {
        await sendParticipationEvenement(event, participant);
      } catch (error) {
        Logger.error(
          `Une erreur est survenue lors de l'envoie de mail rappel de participation à un évènement`,
          error
        );
      }
    }
    await EventService.updateReminderSent(event.id);
  }
}

export const cronEvents = () => {
  sendReminderEvents();
  schedule("0 8 * * *", () => {
    // Cette tâche s'exécute tous les jours à 8h00
    sendReminderEvents();
  });
};
