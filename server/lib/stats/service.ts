import { AppDataSource } from "../../utils/typeorm-client";
import { Stats } from "./entity";
import { ObjectId } from "bson";

const statsRepository = AppDataSource.getRepository(Stats);

export async function findAllStats(): Promise<Stats[]> {
  return statsRepository.findBy({});
}

export async function deleteAllStats(): Promise<void> {
  await statsRepository.clear();
}

export async function createOne(name: string, value: Object): Promise<Stats> {
  const entityToSave: Stats = await statsRepository.create({
    name,
    value,
  });
  entityToSave.id = new ObjectId().toHexString();
  return await statsRepository.save(entityToSave);
}

export async function createStats(
  nbCommunesWithBanErrors = 0,
  nbCommunesStillWithBanErrors = [],
  nbRevisionsWithBanErrors = 0,
  nbRevisionsWithWarnings = 0
): Promise<void> {
  await deleteAllStats();
  await createOne("nbCommunesWithBanErrors", nbCommunesWithBanErrors);
  await createOne("nbCommunesStillWithBanErrors", nbCommunesStillWithBanErrors);
  await createOne("nbRevisionsWithBanErrors", nbRevisionsWithBanErrors);
  await createOne("nbRevisionsWithWarnings", nbRevisionsWithWarnings);
}
