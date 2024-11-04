import { EventDTO } from "./dto";
import { AppDataSource } from "server/utils/typeorm-client";
import { Event } from "./entity";
import { FindOptionsWhere } from "typeorm";
import { validateOrReject } from "class-validator";

const eventRepository = AppDataSource.getRepository(Event);

export async function findMany(query: any = {}): Promise<Event[]> {
  const { type, isSubscriptionClosed } = query;

  const where: FindOptionsWhere<Event> = {};

  if (type) {
    where.type = type;
  }

  if (isSubscriptionClosed) {
    where.isSubscriptionClosed = isSubscriptionClosed;
  }

  return eventRepository.findBy(where);
}

export async function findOneOrFail(id: string): Promise<Event> {
  const record = await eventRepository.findOneBy({ id });

  if (!record) {
    throw new Error(`Evènement ${id} introuvable`);
  }

  return record;
}

export async function createOne(payload: EventDTO): Promise<Event> {
  await validateOrReject(payload);
  const entityToSave: Event = await eventRepository.create(payload);
  return eventRepository.save(entityToSave);
}

export async function createMany(events: EventDTO[]): Promise<void> {
  // Check first that all events are valid
  for (const event of events) {
    validateOrReject(event);
  }
  for await (const event of events) {
    await createOne(event);
  }
}

export async function updateOne(id: string, payload: EventDTO) {
  await eventRepository.update({ id }, payload);
  return findOneOrFail(id);
}

export async function deleteOne(id: string) {
  await eventRepository.delete({ id });
  return true;
}
