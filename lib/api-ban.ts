import { Alert } from "types/alerts.types";

const NEXT_PUBLIC_API_BAN_URL =
  process.env.NEXT_PUBLIC_API_BAN_URL ||
  "https://plateforme.adresse.data.gouv.fr";

async function processResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  try {
    return await res.json();
  } catch {
    return res;
  }
}

export async function getCommuneAlerts(codeCommune: string): Promise<Alert[]> {
  const response = await fetch(
    `${NEXT_PUBLIC_API_BAN_URL}/api/alerts/communes/${codeCommune}/status?limit=10`
  );

  const json = await processResponse(response);
  return json.response.revisions_recentes;
}
