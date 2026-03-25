import { Client, ClientTypeEnum } from "./entity";
import { Perimeter } from "./pertimeters/entity";
import { Logger } from "../../../utils/logger.utils";

const API_DEPOT_URL =
  process.env.NEXT_PUBLIC_API_DEPOT_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";
const { API_DEPOT_TOKEN } = process.env;

const API_MOISSONEUR_BAL =
  process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL ||
  "https://plateforme-bal.adresse.data.gouv.fr/moissonneur";
const { API_MOISSONEUR_BAL_TOKEN } = process.env;

type PerimeterPayload = Pick<Perimeter, "id" | "type" | "code">;

async function syncApiDepotClient(
  clientId: string,
  perimeters: PerimeterPayload[],
): Promise<void> {
  const response = await fetch(
    `${API_DEPOT_URL}/clients/${clientId}/chef_de_file/perimeter`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_DEPOT_TOKEN}`,
      },
      body: JSON.stringify({ perimeters }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to sync api-depot client ${clientId}: ${response.status}`,
    );
  }
}

async function syncMoissonneurClient(
  organizationId: string,
  perimeters: PerimeterPayload[],
): Promise<void> {
  const response = await fetch(
    `${API_MOISSONEUR_BAL}/organizations/${organizationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_MOISSONEUR_BAL_TOKEN}`,
      },
      body: JSON.stringify({ perimeters }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to sync moissonneur organization ${organizationId}: ${response.status}`,
    );
  }
}

export async function syncClientsPerimeters(clients: Client[]): Promise<void> {
  for (const client of clients) {
    const perimeters: PerimeterPayload[] = (client.perimeters ?? []).map(
      ({ type, code, id }) => ({ type, code, id }),
    );

    try {
      if (client.type === ClientTypeEnum.API_DEPOT) {
        await syncApiDepotClient(client.clientId, perimeters);
      } else if (client.type === ClientTypeEnum.MOISSONNEUR_BAL) {
        await syncMoissonneurClient(client.clientId, perimeters);
      }
    } catch (error) {
      Logger.error(
        `Erreur lors de la synchronisation des périmètres pour le client ${client.clientId}`,
        error,
      );
    }
  }
}
