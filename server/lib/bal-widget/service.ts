import { ObjectId } from "bson";
import { AppDataSource } from "../../utils/typeorm-client";
import { BalWidget } from "./entity";

const balWidgetRepository = AppDataSource.getRepository(BalWidget);

export async function getConfig(): Promise<BalWidget> {
  try {
    const { id, createdAt, updatedAt, ...record } =
      await balWidgetRepository.findOneByOrFail({});
    return record;
  } catch (error) {
    return null;
  }
}

export async function setConfig(payload: BalWidget) {
  const record = await await balWidgetRepository.findOneByOrFail({});
  if (!record) {
    payload.id = new ObjectId().toHexString();
    await balWidgetRepository.insert(payload);
  } else {
    const res = await balWidgetRepository.update({ id: record.id }, payload);
  }

  return getConfig();
}
