import { AppDataSource } from "../../utils/typeorm-client";
import { Stats } from "./entity";
import { ObjectId } from "bson";

const statsRepository = AppDataSource.getRepository(Stats);

export async function findAllStats(): Promise<Stats[]> {
  return statsRepository.findBy({});
}

export async function deleteOne(name: string): Promise<void> {
  await statsRepository.delete({ name });
}

export async function createOne(name: string, value: Object): Promise<Stats> {
  const entityToSave: Stats = await statsRepository.create({
    name,
    value,
  });
  entityToSave.id = new ObjectId().toHexString();
  return await statsRepository.save(entityToSave);
}
