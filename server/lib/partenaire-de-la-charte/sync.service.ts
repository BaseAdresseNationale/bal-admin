import { ObjectId } from "bson";
import { AppDataSource } from "../../utils/typeorm-client";
import { Logger } from "../../utils/logger.utils";
import { Client, ClientTypeEnum } from "./clients/entity";
import { Perimeter, TypePerimeterEnum } from "./clients/pertimeters/entity";
import { Client as ApiDepotClient, ChefDeFile } from "../../../types/api-depot.types";

const clientRepository = AppDataSource.getRepository(Client);

const API_DEPOT_URL =
  process.env.NEXT_PUBLIC_API_DEPOT_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";

const MOISSONNEUR_BAL_URL =
  process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL ||
  "https://plateforme-bal.adresse.data.gouv.fr/moissonneur";

type MoissonneurOrganization = {
  id: string;
  name: string;
  perimeters: { type: TypePerimeterEnum; code: string }[];
  deletedAt: Date | null;
};

async function fetchApiDepotClients(): Promise<ApiDepotClient[]> {
  const response = await fetch(`${API_DEPOT_URL}/clients`);
  if (!response.ok) {
    throw new Error(`Failed to fetch API Depot clients: ${response.status}`);
  }
  return response.json();
}

async function fetchChefsDeFile(): Promise<Map<string, ChefDeFile>> {
  const response = await fetch(`${API_DEPOT_URL}/chefs-de-file`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chefs de file: ${response.status}`);
  }
  const chefsDeFile: ChefDeFile[] = await response.json();
  return new Map(chefsDeFile.map((cdf) => [cdf.id, cdf]));
}

async function fetchMoissonneurOrganizations(): Promise<MoissonneurOrganization[]> {
  const response = await fetch(`${MOISSONNEUR_BAL_URL}/organizations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch moissonneur organizations: ${response.status}`);
  }
  return response.json();
}

function buildPerimeters(
  rawPerimeters: { type: TypePerimeterEnum; code: string }[],
): Perimeter[] {
  return (rawPerimeters ?? []).map((p) => {
    const perimeter = new Perimeter();
    perimeter.id = new ObjectId().toHexString();
    perimeter.type = p.type;
    perimeter.code = p.code;
    return perimeter;
  });
}

async function syncApiDepotClients(
  existingByClientId: Map<string, Client>,
): Promise<Set<string>> {
  const [apiDepotClients, chefsDeFile] = await Promise.all([
    fetchApiDepotClients(),
    fetchChefsDeFile(),
  ]);

  const syncedClientIds = new Set<string>();

  for (const remote of apiDepotClients) {
    syncedClientIds.add(remote.id);
    const chefDeFile = remote.chefDeFileId ? chefsDeFile.get(remote.chefDeFileId) : undefined;
    const perimeters = buildPerimeters(chefDeFile?.perimeters as { type: TypePerimeterEnum; code: string }[] ?? []);

    const existing = existingByClientId.get(`${ClientTypeEnum.API_DEPOT}:${remote.id}`);

    if (existing) {
      existing.name = remote.nom;
      existing.deletedAt = remote.isActive ? null : new Date();
      existing.perimeters = perimeters;
      await clientRepository.save(existing);
    } else {
      const client = clientRepository.create({
        id: new ObjectId().toHexString(),
        name: remote.nom,
        clientId: remote.id,
        type: ClientTypeEnum.API_DEPOT,
        deletedAt: remote.isActive ? null : new Date(),
        perimeters,
      });
      await clientRepository.save(client);
    }
  }

  return syncedClientIds;
}

async function syncMoissonneurClients(
  existingByClientId: Map<string, Client>,
): Promise<Set<string>> {
  const organizations = await fetchMoissonneurOrganizations();
  const syncedClientIds = new Set<string>();

  for (const remote of organizations) {
    syncedClientIds.add(remote.id);
    const perimeters = buildPerimeters(remote.perimeters);

    const existing = existingByClientId.get(`${ClientTypeEnum.MOISSONNEUR_BAL}:${remote.id}`);

    if (existing) {
      existing.name = remote.name;
      existing.deletedAt = remote.deletedAt;
      existing.perimeters = perimeters;
      await clientRepository.save(existing);
    } else {
      const client = clientRepository.create({
        id: new ObjectId().toHexString(),
        name: remote.name,
        clientId: remote.id,
        type: ClientTypeEnum.MOISSONNEUR_BAL,
        deletedAt: remote.deletedAt,
        perimeters,
      });
      await clientRepository.save(client);
    }
  }

  return syncedClientIds;
}

export async function syncClients(): Promise<void> {
  const allExisting = await clientRepository.find({ withDeleted: true });
  const existingByClientId = new Map(
    allExisting.map((c) => [`${c.type}:${c.clientId}`, c]),
  );

  const [syncedApiDepotIds, syncedMoissonneurIds] = await Promise.all([
    syncApiDepotClients(existingByClientId).catch((error) => {
      Logger.error("Erreur lors de la synchronisation des clients api-depot", error);
      return new Set<string>();
    }),
    syncMoissonneurClients(existingByClientId).catch((error) => {
      Logger.error("Erreur lors de la synchronisation des organisations moissonneur-bal", error);
      return new Set<string>();
    }),
  ]);

  // Soft-delete local clients absent des sources distantes
  for (const [key, client] of Array.from(existingByClientId)) {
    if (client.deletedAt) continue;

    const isStale =
      (client.type === ClientTypeEnum.API_DEPOT && !syncedApiDepotIds.has(client.clientId)) ||
      (client.type === ClientTypeEnum.MOISSONNEUR_BAL && !syncedMoissonneurIds.has(client.clientId));

    if (isStale) {
      await clientRepository.softDelete(client.id);
      Logger.info(`Client ${key} soft-deleted (absent de la source distante)`);
    }
  }
}
