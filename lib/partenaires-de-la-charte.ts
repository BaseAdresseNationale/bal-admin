import { PartenaireDeLaCharteDTO } from "server/lib/partenaire-de-la-charte/dto";
import { PartenaireDeLaCharte } from "../server/lib/partenaire-de-la-charte/entity";
import { Review } from "server/lib/partenaire-de-la-charte/reviews/entity";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
}

export async function getPartenaireDeLaCharte(id: string, headers?: any) {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`,
    { headers }
  );
  const partenaireDeLaCharte = await processResponse(response);

  return partenaireDeLaCharte as PartenaireDeLaCharte;
}

export async function getPartenairesDeLaCharte(): Promise<
  PartenaireDeLaCharte[]
> {
  const url = new URL(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`
  );
  url.searchParams.append("withCandidates", "true");
  url.searchParams.append("withoutPictures", "true");

  const response = await fetch(url);
  const partenairesDeLaCharte = await processResponse(response);

  return partenairesDeLaCharte as PartenaireDeLaCharte[];
}

export async function getPartenaireDeLaCharteByClientApiDepot(
  apiDepotClientId: string
): Promise<PartenaireDeLaCharte[]> {
  const url = new URL(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`
  );
  url.searchParams.append("apiDepotClientId", apiDepotClientId);

  const response = await fetch(url);
  const partenairesDeLaCharte = await processResponse(response);

  return partenairesDeLaCharte as PartenaireDeLaCharte[];
}

export async function getPartenaireDeLaCharteByOrganizationDataGouv(
  dataGouvOrganizationId: string
): Promise<PartenaireDeLaCharte[]> {
  const url = new URL(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`
  );
  url.searchParams.append("dataGouvOrganizationId", dataGouvOrganizationId);

  const response = await fetch(url);
  const partenairesDeLaCharte = await processResponse(response);

  return partenairesDeLaCharte as PartenaireDeLaCharte[];
}

export async function createPartenaireDeLaCharte(
  payload: PartenaireDeLaCharteDTO
): Promise<PartenaireDeLaCharte> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const partenaireDeLaCharte = await processResponse(response);

  return partenaireDeLaCharte as PartenaireDeLaCharte;
}

export async function updatePartenaireDeLaCharte(
  id: string,
  payload: PartenaireDeLaCharteDTO,
  acceptCandidacy = false
): Promise<PartenaireDeLaCharte> {
  const url = new URL(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`
  );
  if (acceptCandidacy) {
    url.searchParams.append("acceptCandidacy", "true");
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const partenaireDeLaCharte = await processResponse(response);

  return partenaireDeLaCharte as PartenaireDeLaCharte;
}

export async function deletePartenaireDeLaCharte(id: string): Promise<boolean> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/${id}`,
    {
      method: "DELETE",
    }
  );
  const isDeleted = await processResponse(response);

  return isDeleted as boolean;
}

export async function updateReview(
  id: string,
  payload: Partial<Review>
): Promise<boolean> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/reviews/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const isUpdated = await processResponse(response);

  return isUpdated as boolean;
}

export async function deleteReview(id: string): Promise<boolean> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/partenaires-de-la-charte/reviews/${id}`,
    {
      method: "DELETE",
    }
  );
  const isDeleted = await processResponse(response);

  return isDeleted as boolean;
}
