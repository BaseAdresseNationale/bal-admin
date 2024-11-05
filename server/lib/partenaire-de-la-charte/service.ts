import { validateOrReject } from "class-validator";

import { sendTemplateMail } from "../mailer/service";
import { PartenaireDeLaCharteDTO } from "./dto";
import { AppDataSource } from "../../utils/typeorm-client";
import { PartenaireDeLaCharte, PartenaireDeLaCharteTypeEnum } from "./entity";
import { FindOptionsWhere, In, IsNull, Not } from "typeorm";
import { ObjectId } from "bson";

const partenaireDeLaCharteRepository =
  AppDataSource.getRepository(PartenaireDeLaCharte);

export async function findMany(query: any = {}) {
  const {
    codeDepartement,
    services,
    type,
    withCandidates,
    withoutPictures,
    dataGouvOrganizationId,
    apiDepotClientId,
  } = query;

  const where: FindOptionsWhere<PartenaireDeLaCharte> = {
    ...(type && { type }),
    ...(dataGouvOrganizationId && { dataGouvOrganizationId }),
    ...(apiDepotClientId && { apiDepotClientId }),
  };

  if (!withCandidates) {
    where.signatureDate = Not(IsNull());
  }

  if (services) {
    where.services = In(services.split(","));
  }

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder()
    .where(where);
  if (codeDepartement) {
    queryPG.andWhere(
      "codeDepartement = :codeDepartement OR isPerimeterFrance IS true",
      { codeDepartement }
    );
  }
  const records: PartenaireDeLaCharte[] = await queryPG.getMany();

  if (withoutPictures) {
    return records.map((record) => {
      const { picture, ...rest } = record;
      return rest;
    });
  }

  return records;
}

export async function findManyPaginated(query: any = {}, page = 1, limit = 10) {
  const {
    codeDepartement,
    services,
    type,
    withCandidates,
    withoutPictures,
    dataGouvOrganizationId,
    apiDepotClientId,
  } = query;

  const offset = (page - 1) * limit;

  const where: FindOptionsWhere<PartenaireDeLaCharte> = {
    ...(type && { type }),
    ...(dataGouvOrganizationId && { dataGouvOrganizationId }),
    ...(apiDepotClientId && { apiDepotClientId }),
  };

  if (!withCandidates) {
    where.signatureDate = Not(IsNull());
  }

  if (services) {
    where.services = In(services.split(","));
  }

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder()
    .where(where)
    .limit(limit)
    .offset(offset);

  if (codeDepartement) {
    queryPG.andWhere(
      "codeDepartement = :codeDepartement OR isPerimeterFrance IS true",
      { codeDepartement }
    );
  }
  const [records, total]: [PartenaireDeLaCharte[], number] =
    await queryPG.getManyAndCount();

  const totalCommunes: number = await partenaireDeLaCharteRepository.countBy({
    type: PartenaireDeLaCharteTypeEnum.COMMUNE,
  });

  const totalOrganismes: number = await partenaireDeLaCharteRepository.countBy({
    type: PartenaireDeLaCharteTypeEnum.ORGANISME,
  });

  const totalEntreprises: number = await partenaireDeLaCharteRepository.countBy(
    {
      type: PartenaireDeLaCharteTypeEnum.ENTREPRISE,
    }
  );

  if (withoutPictures) {
    return records.map((record) => {
      const { picture, ...rest } = record;
      return rest;
    });
  }

  return {
    total,
    totalCommunes,
    totalOrganismes,
    totalEntreprises,
    data: records,
  };
}

export async function findOneOrFail(id: string) {
  const record = await partenaireDeLaCharteRepository.findOneByOrFail({ id });

  if (!record) {
    throw new Error(`Partenaire de la charte ${id} introuvable`);
  }

  return record;
}

export async function createOne(
  payload: PartenaireDeLaCharteDTO,
  options: any = {}
): Promise<PartenaireDeLaCharte> {
  const { isCandidate, noValidation } = options;
  if (!noValidation) {
    await validateOrReject(payload);
  }

  const entityToSave: PartenaireDeLaCharte =
    partenaireDeLaCharteRepository.create(payload);

  entityToSave.id = new ObjectId().toHexString();

  if (!isCandidate) {
    entityToSave.signatureDate = new Date();
  }

  const newRecord: PartenaireDeLaCharte =
    await partenaireDeLaCharteRepository.save(entityToSave);

  if (isCandidate) {
    try {
      await sendTemplateMail("candidature-partenaire-de-la-charte");
    } catch (error) {
      console.error(error);
    }
  }

  return newRecord;
}

export async function updateOne(
  id: string,
  payload: PartenaireDeLaCharteDTO,
  { acceptCandidacy = false }
): Promise<PartenaireDeLaCharte> {
  await validateOrReject(payload);
  if (
    !acceptCandidacy &&
    Number.isNaN(Date.parse(payload.signatureDate as string))
  ) {
    throw Error("Invalid payload");
  }
  payload.signatureDate = acceptCandidacy
    ? new Date()
    : new Date(payload.signatureDate);

  await partenaireDeLaCharteRepository.update({ id }, payload);

  return findOneOrFail(id);
}

export async function deleteOne(id: string): Promise<boolean> {
  await partenaireDeLaCharteRepository.delete({ id });
  return true;
}
