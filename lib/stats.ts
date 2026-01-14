import { Stats } from "types/stats.type";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
}

export async function getStats(): Promise<
  Array<Stats<number | Array<string>>>
> {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/stats`);
  const stats = await processResponse(response);

  return stats as Array<Stats<number | Array<string>>>;
}
