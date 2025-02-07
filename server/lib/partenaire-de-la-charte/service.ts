import { validateOrReject } from "class-validator";

import { sendTemplateMail } from "../mailer/service";
import { PartenaireDeLaCharteDTO, PartenaireDeLaCharteQuery } from "./dto";
import { AppDataSource } from "../../utils/typeorm-client";
import { PartenaireDeLaCharte, PartenaireDeLaCharteTypeEnum } from "./entity";
import { ArrayContains, FindOptionsWhere, IsNull, Not, ILike } from "typeorm";
import { ObjectId } from "bson";
import { Logger } from "../../utils/logger.utils";

const partenaireDeLaCharteRepository =
  AppDataSource.getRepository(PartenaireDeLaCharte);

function createWherePG({
  search,
  services,
  type,
  withCandidates,
  dataGouvOrganizationId,
  apiDepotClientId,
}: Partial<PartenaireDeLaCharteQuery>) {
  const where: FindOptionsWhere<PartenaireDeLaCharte> = {
    ...(type && { type }),
    ...(search && { name: ILike(`%${search}%`) }),
  };

  if (!withCandidates) {
    where.signatureDate = Not(IsNull());
  }

  if (services) {
    if (typeof services === "string") {
      where.services = ArrayContains([services]);
    } else if (Array.isArray(services)) {
      where.services = ArrayContains(services);
    }
  }

  if (dataGouvOrganizationId) {
    if (typeof dataGouvOrganizationId === "string") {
      where.dataGouvOrganizationId = ArrayContains([dataGouvOrganizationId]);
    } else if (Array.isArray(dataGouvOrganizationId)) {
      where.dataGouvOrganizationId = ArrayContains(dataGouvOrganizationId);
    }
  }

  if (apiDepotClientId) {
    if (typeof apiDepotClientId === "string") {
      where.apiDepotClientId = ArrayContains([apiDepotClientId]);
    } else if (Array.isArray(apiDepotClientId)) {
      where.apiDepotClientId = ArrayContains(apiDepotClientId);
    }
  }

  return where;
}

export async function findMany(query: PartenaireDeLaCharteQuery = {}) {
  const { codeDepartement, withoutPictures } = query;
  const where: FindOptionsWhere<PartenaireDeLaCharte> = createWherePG(query);

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder()
    .where(where);

  if (codeDepartement) {
    queryPG.andWhere(
      `code_departement @> :arraySearch OR is_perimeter_france IS true`,
      { arraySearch: [codeDepartement] }
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

export async function findManyPaginated(
  query: PartenaireDeLaCharteQuery = {},
  page = 1,
  limit = 10
) {
  const offset = (page - 1) * limit;

  const { codeDepartement, withoutPictures } = query;
  const where: FindOptionsWhere<PartenaireDeLaCharte> = createWherePG(query);

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder()
    .where(where)
    .limit(limit)
    .offset(offset);

  if (codeDepartement) {
    queryPG.andWhere(
      `code_departement @> :arraySearch OR is_perimeter_france IS true`,
      { arraySearch: [codeDepartement] }
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
      Logger.error(
        `Une erreur est survenue lors de l'envoie de mail de candidature`,
        error
      );
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

export async function findServicesWithCount(
  query: PartenaireDeLaCharteQuery = {}
) {
  const records = await findMany(query);

  const services = records.reduce((acc, record) => {
    record.services.forEach((service) => {
      acc[service] = acc[service] ? acc[service] + 1 : 1;
    });
    return acc;
  }, {});

  return services;
}

export async function deleteOne(id: string): Promise<boolean> {
  await partenaireDeLaCharteRepository.delete({ id });
  return true;
}
