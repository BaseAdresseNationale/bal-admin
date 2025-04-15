import { schedule } from "node-cron";
import * as EventService from "./service";
import { Event } from "./entity";
import { Participant } from "../participant/entity";
import { findManyByEvent } from "../participant/service";
import { sendParticipationEvenement } from "../mailer/service";
import { Logger } from "../../utils/logger.utils";
import { addDays } from "date-fns";

const adminParticipants: Participant[] = [
  {
    eventId: null,
    fullname: "Olivier Bourreau",
    community: "BAL",
    function: "ADMIN",
    email: "olivier.bourreau@beta.gouv.fr",
  },
  {
    eventId: null,
    fullname: "Yoann Merrien",
    community: "BAL",
    function: "ADMIN",
    email: "yoann.merrien@beta.gouv.fr",
  },
];

async function sendReminderEvents() {
  const today = addDays(new Date(), 1).toISOString().split("T")[0];
  const events: Event[] = await EventService.findMany({
    date: today,
    reminderSent: false,
  });
  for (const event of events) {
    const participants: Participant[] = await findManyByEvent(event.id);
    participants.push(...adminParticipants);
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
