import { validateOrReject } from "class-validator";
import { sendTemplateMail } from "../mailer/service";
import { PartenaireDeLaCharteDTO, PartenaireDeLaCharteQuery } from "./dto";
import { AppDataSource } from "../../utils/typeorm-client";
import { PartenaireDeLaCharte, PartenaireDeLaCharteTypeEnum } from "./entity";
import { ArrayContains, FindOptionsWhere, IsNull, Not, ILike } from "typeorm";
import { ObjectId } from "bson";
import { Logger } from "../../utils/logger.utils";
import { Client } from "./clients/entity";
import { syncClientsPerimeters } from "./clients/sync.service";
import { TypePerimeterEnum } from "./clients/pertimeters/entity";
import { getCommune, getEPCICodeFromCommune } from "../../../lib/cog";
import { S3Service } from "../../utils/s3";
import { omit } from 'lodash'

const partenaireDeLaCharteRepository =
  AppDataSource.getRepository(PartenaireDeLaCharte);
const clientRepository = AppDataSource.getRepository(Client);

function createWherePG({
  search,
  services,
  type,
  withCandidates,
  codeCommune,
}: Partial<PartenaireDeLaCharteQuery>) {
  const where: FindOptionsWhere<PartenaireDeLaCharte> = {
    ...(type && { type }),
    ...(search && { name: ILike(`%${search}%`) }),
  };

  if (!withCandidates) {
    where.charteSignatureDate = Not(IsNull());
  }

  if (services) {
    if (typeof services === "string") {
      where.services = ArrayContains([services]);
    } else if (Array.isArray(services)) {
      where.services = ArrayContains(services);
    }
  }

  if (codeCommune) {
    const commune = getCommune(codeCommune);
    const codeDepartement = commune?.departement ?? null;
    const codeEpci = getEPCICodeFromCommune(codeCommune);
    return {
      where,
      perimetersFilter: { codeCommune, codeDepartement, codeEpci },
    };
  }

  return { where, perimetersFilter: null };
}

type PerimetersFilter = {
  codeCommune: string;
  codeDepartement: string | null;
  codeEpci: string | null;
};

function applyPerimetersFilter(
  queryPG: ReturnType<typeof partenaireDeLaCharteRepository.createQueryBuilder>,
  perimetersFilter: PerimetersFilter,
) {
  const { codeCommune, codeDepartement, codeEpci } = perimetersFilter;
  const conditions: string[] = [
    `(p.type = :typeCommune AND p.code = :codeCommune)`,
  ];
  const params: Record<string, string> = {
    typeCommune: TypePerimeterEnum.COMMUNE,
    codeCommune,
  };
  if (codeDepartement) {
    conditions.push(`(p.type = :typeDepartement AND p.code = :codeDepartement)`);
    params.typeDepartement = TypePerimeterEnum.DEPARTEMENT;
    params.codeDepartement = codeDepartement;
  }
  if (codeEpci) {
    conditions.push(`(p.type = :typeEpci AND p.code = :codeEpci)`);
    params.typeEpci = TypePerimeterEnum.EPCI;
    params.codeEpci = codeEpci;
  }
  queryPG.andWhere(
    `EXISTS (
      SELECT 1 FROM clients c
      INNER JOIN perimeters p ON p.client_id = c.id
      WHERE c.partenaire_id = "partenaireDeLaCharte"."id"
      AND c.deleted_at IS NULL
      AND (${conditions.join(" OR ")})
    )`,
    params,
  );
}

export async function findMany(query: PartenaireDeLaCharteQuery = {}) {
  const { coverDepartement } = query;
  const { where, perimetersFilter } = createWherePG(query);

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder("partenaireDeLaCharte")
    .withDeleted()
    .leftJoinAndSelect("partenaireDeLaCharte.entrepriseReviews", "reviews")
    .leftJoinAndSelect("partenaireDeLaCharte.clients", "clients")
    .leftJoinAndSelect("clients.perimeters", "perimeters")
    .addSelect(
      "COUNT(case when reviews.is_email_verified = true and reviews.is_published = false then 1 else null end)",
      "pending_reviews_count",
    )
    .groupBy("partenaireDeLaCharte.id, reviews.id, clients.id, perimeters.id")
    .orderBy("pending_reviews_count", "DESC")
    .where(where);

  if (perimetersFilter) {
    applyPerimetersFilter(queryPG, perimetersFilter);
  }

  if (coverDepartement) {
    queryPG.andWhere(
      `(cover_departement @> :arraySearch OR entreprise_is_perimeter_france IS true)`,
      { arraySearch: [coverDepartement] },
    );
  }

  const records: PartenaireDeLaCharte[] = await queryPG.getMany();

  return records;
}

export async function findManyPaginated(
  query: PartenaireDeLaCharteQuery = {},
  page = 1,
  limit = 10,
) {
  const offset = (page - 1) * limit;

  const { coverDepartement, shuffleResults } = query;
  const { where, perimetersFilter } = createWherePG(query);

  const queryPG = partenaireDeLaCharteRepository
    .createQueryBuilder("partenaireDeLaCharte")
    .leftJoinAndSelect("partenaireDeLaCharte.entrepriseReviews", "reviews")
    .leftJoinAndSelect("partenaireDeLaCharte.clients", "clients")
    .leftJoinAndSelect("clients.perimeters", "perimeters")
    .where(where)
    .take(limit)
    .skip(offset);

  if (perimetersFilter) {
    applyPerimetersFilter(queryPG, perimetersFilter);
  }

  if (coverDepartement) {
    queryPG.andWhere(
      `(cover_departement @> :arraySearch OR entreprise_is_perimeter_france IS true)`,
      { arraySearch: [coverDepartement] },
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
    },
  );

  let data = records;

  if (shuffleResults) {
    data = records.sort(() => Math.random() - 0.5);
  }

  return {
    total,
    totalCommunes,
    totalOrganismes,
    totalEntreprises,
    data,
  };
}

export async function findOneOrFail(id: string) {
  const record = await partenaireDeLaCharteRepository.findOneOrFail({
    where: { id },
    withDeleted: true,
  });

  if (!record) {
    throw new Error(`Partenaire de la charte ${id} introuvable`);
  }

  return record;
}

function fillPerimetersIds(clients: Client[]) {
  for (const client of clients) {
    if (client.perimeters) {
      for (const perimeter of client.perimeters) {
        if (!perimeter.id) {
          perimeter.id = new ObjectId().toHexString();
        }
      }
    }
  }
}

async function uploadPublicFile(partenaireId: string, picture: string): Promise<string | undefined> {
  const match = picture.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    console.warn(`Invalid base64 picture for partenaire ${partenaireId}`);
    return
  }
  const contentType = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const ext = contentType.split('/')[1] ?? 'png';
  const fileName = `partenaires/${partenaireId}.${ext}`;

  const res = await S3Service.uploadPublicFile(
    fileName,
    process.env.S3_CONTAINER_ID,
    buffer,
    { ContentType: contentType },
  );

  return fileName
}

export async function createOne(
  payload: PartenaireDeLaCharteDTO,
  options: any = {},
): Promise<PartenaireDeLaCharte> {
  const { isCandidate, noValidation } = options;
  if (!noValidation) {
    await validateOrReject(payload);
  }

  const entityToSave: PartenaireDeLaCharte =
    partenaireDeLaCharteRepository.create(payload);

  entityToSave.id = new ObjectId().toHexString();

  if (!isCandidate) {
    entityToSave.charteSignatureDate = new Date();
  }

  if (payload.clients) {
    fillPerimetersIds(payload.clients);
  }

  let newRecord: PartenaireDeLaCharte =
    await partenaireDeLaCharteRepository.save(entityToSave);

  if (payload.clients) {
    await syncClientsPerimeters(payload.clients);
  }


  if (payload.picture) {
    const fileName = await uploadPublicFile(newRecord.id, payload.picture)

    if (fileName) {
      newRecord.pictureUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_CONTAINER_ID}/${fileName}`;
      newRecord = await partenaireDeLaCharteRepository.save(entityToSave);
    }
  }

  if (isCandidate) {
    try {
      await sendTemplateMail("candidature-partenaire-de-la-charte");
    } catch (error) {
      Logger.error(
        `Une erreur est survenue lors de l'envoie de mail de candidature`,
        error,
      );
    }
  }

  return newRecord;
}

export async function updateOne(
  id: string,
  payload: PartenaireDeLaCharteDTO,
  { acceptCandidacy = false },
): Promise<PartenaireDeLaCharte> {
  await validateOrReject(payload);
  if (
    !acceptCandidacy &&
    Number.isNaN(Date.parse(payload.charteSignatureDate as string))
  ) {
    throw Error("Invalid payload");
  }
  payload.charteSignatureDate = acceptCandidacy
    ? new Date()
    : new Date(payload.charteSignatureDate);

  if (payload.clients) {
    fillPerimetersIds(payload.clients);
  }
  const instance = await findOneOrFail(id);

  const payloadClientIds = (payload.clients || [])
    .map((c) => c.id)
    .filter(Boolean);
  const clientsToUnlink = (instance.clients || []).filter(
    (c) => c.id && !payloadClientIds.includes(c.id),
  );
  if (clientsToUnlink.length > 0) {
    await clientRepository.update(
      clientsToUnlink.map((c) => c.id),
      { partenaireId: null },
    );
  }

  if (payload.picture) {
    const fileName = await uploadPublicFile(instance.id, payload.picture)
    if (fileName) {
      instance.pictureUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_CONTAINER_ID}/${fileName}`;
    }
  }

  Object.assign(instance, omit(payload, ['picture']));
  await partenaireDeLaCharteRepository.save(instance);

  if (payload.clients) {
    await syncClientsPerimeters(payload.clients);
  }

  return findOneOrFail(id);
}

export async function findServicesWithCount(
  query: PartenaireDeLaCharteQuery = {},
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

