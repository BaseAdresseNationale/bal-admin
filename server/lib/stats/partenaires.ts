import { Not, IsNull } from "typeorm";
import { AppDataSource } from "../../utils/typeorm-client";
import {
  PartenaireDeLaCharte,
  PartenaireDeLaCharteTypeEnum,
} from "../partenaire-de-la-charte/entity";

export type PartenaireStat = { name: string; type: string };

function resolvePartenaireType(
  record: Pick<PartenaireDeLaCharte, "type" | "organismeType">,
): string {
  if (record.type === PartenaireDeLaCharteTypeEnum.COMMUNE) return "commune";
  if (record.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE)
    return "entreprise";
  return record.organismeType;
}

export async function computePartenairesStat(): Promise<PartenaireStat[]> {
  const repository = AppDataSource.getRepository(PartenaireDeLaCharte);
  const records = await repository.find({
    select: { name: true, type: true, organismeType: true },
    where: { charteSignatureDate: Not(IsNull()) },
  });

  return records.map((record) => ({
    name: record.name,
    type: resolvePartenaireType(record),
  }));
}
