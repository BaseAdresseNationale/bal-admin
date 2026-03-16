import { ObjectId } from "bson";
import { AppDataSource } from "../../../utils/typeorm-client";
import { Client } from "./entity";
import { ClientDTO } from "./dto";

const clientRepository = AppDataSource.getRepository(Client);

export async function findAll(): Promise<Client[]> {
  return clientRepository.find({ withDeleted: true });
}

export async function createOne(payload: ClientDTO): Promise<Client> {
  const client = clientRepository.create({
    ...payload,
    id: new ObjectId().toHexString(),
    perimeters: (payload.perimeters ?? []).map((p) => ({
      ...p,
      id: p.id ?? new ObjectId().toHexString(),
    })),
  });
  const saved = await clientRepository.save(client);
  return saved;
}

export async function updateOne(
  clientId: string,
  payload: ClientDTO,
): Promise<Client> {
  const instance = await clientRepository.findOneByOrFail({ clientId });
  Object.assign(instance, {
    ...payload,
    perimeters: (payload.perimeters ?? []).map((p) => ({
      ...p,
      id: p.id ?? new ObjectId().toHexString(),
    })),
  });
  const saved = await clientRepository.save(instance);
  return saved;
}

export async function restore(clientId: string): Promise<void> {
  await clientRepository.restore({ clientId });
}

export async function deleteOne(clientId: string): Promise<void> {
  await clientRepository.softDelete({ clientId });
}
