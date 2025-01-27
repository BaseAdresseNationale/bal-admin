import { schedule } from "node-cron";
import * as EventService from "./service";
import { Event } from "./entity";
import { Participant } from "../participant/entity";
import { findManyByEvent } from "../participant/service";
import { sendParticipationEvenement } from "../mailer/service";

async function sendReminderEvents() {
  const today = new Date().toISOString().split("T")[0];
  const events: Event[] = await EventService.findMany({
    date: today,
    reminderSend: false,
  });
  for (const event of events) {
    const participants: Participant[] = await findManyByEvent(event.id);
    for (const participant of participants) {
      await sendParticipationEvenement(event, participant);
    }
    await EventService.reminderSent(event.id);
  }
}

export const cronEvents = () => {
  sendReminderEvents();
  schedule("0 8 * * *", () => {
    // Cette tâche s'exécute tous les jours à 8h00
    sendReminderEvents();
  });
};
