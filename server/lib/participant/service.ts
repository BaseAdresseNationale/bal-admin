import { ParticipantDTO } from "./dto";
import { AppDataSource } from "../../utils/typeorm-client";
import { Participant } from "./entity";
import { FindOptionsWhere } from "typeorm";
import { validateOrReject } from "class-validator";
import { ObjectId } from "bson";

const eventRepository = AppDataSource.getRepository(Participant);

export async function findManyByEvent(eventId: string): Promise<Participant[]> {
  const where: FindOptionsWhere<Participant> = {
    eventId,
  };
  return eventRepository.findBy(where);
}

export async function createOneByEvent(
  eventId: string,
  payload: ParticipantDTO
): Promise<Participant> {
  await validateOrReject(payload);
  const entityToSave: Participant = await eventRepository.create({
    eventId,
    ...payload,
  });
  entityToSave.id = new ObjectId().toHexString();
  return eventRepository.save(entityToSave);
}
