import { ParticipantDTO } from "./dto";
import { AppDataSource } from "../../utils/typeorm-client";
import { Participant } from "./entity";
import { FindOptionsWhere } from "typeorm";
import { validateOrReject } from "class-validator";
import { ObjectId } from "bson";
import { sendParticipationEvenement } from "../mailer/service";
import { Event } from "../events/entity";

const eventRepository = AppDataSource.getRepository(Participant);

export async function findManyByEvent(eventId: string): Promise<Participant[]> {
  const where: FindOptionsWhere<Participant> = {
    eventId,
  };
  return eventRepository.findBy(where);
}

export async function createOneByEvent(
  event: Event,
  payload: ParticipantDTO
): Promise<Participant> {
  await validateOrReject(payload);
  const entityToSave: Participant = await eventRepository.create({
    eventId: event.id,
    ...payload,
  });
  entityToSave.id = new ObjectId().toHexString();
  const participant = await eventRepository.save(entityToSave);

  if (participant) {
    sendParticipationEvenement(event, participant)
  }

  return participant
}
