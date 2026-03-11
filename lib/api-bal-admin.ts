import { Client } from "server/lib/partenaire-de-la-charte/clients/entity";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/clients`);
  if (!res.ok) {
    throw new Error("Impossible de récupérer les clients");
  }
  return res.json();
}
