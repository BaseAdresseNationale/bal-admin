import { AppDataSource } from "../../utils/typeorm-client";
import { BalWidget, TypeBalWidgetEnum } from "./entity";
import { FindOptionsWhere } from "typeorm";

const balWidgetRepository = AppDataSource.getRepository(BalWidget);

export async function getConfig(query: any = {}) {
  const { draft } = query;

  const where: FindOptionsWhere<BalWidget> = {
    type: draft ? TypeBalWidgetEnum.DRAFT : TypeBalWidgetEnum.PUBLISHED,
  };

  try {
    const { id, createdAt, updatedAt, ...record } =
      await balWidgetRepository.findOneBy(where);

    return record;
  } catch (error) {
    return null;
  }
}

export async function setConfig(payload: any) {
  const { draft, ...update } = payload;
  const where: FindOptionsWhere<BalWidget> = {
    type: draft ? TypeBalWidgetEnum.DRAFT : TypeBalWidgetEnum.PUBLISHED,
  };
  const record = await balWidgetRepository.findOneBy(where);

  if (!record) {
    await balWidgetRepository.insert(update);
  } else {
    await balWidgetRepository.update(record.id, update);
  }

  return getConfig({ draft });
}
