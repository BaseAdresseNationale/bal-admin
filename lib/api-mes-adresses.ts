import type { BaseLocaleType } from "../types/mes-adresses";
import type { PageType } from "../types/page";

const NEXT_PUBLIC_API_MES_ADRESSES =
  process.env.NEXT_PUBLIC_API_MES_ADRESSES ||
  "https://api-bal.adresse.data.gouv.fr/v2";
const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";
const PROXY_MES_ADRESSES_API =
  NEXT_PUBLIC_BAL_ADMIN_URL + "/api/proxy-mes-adresses-api";

export type SearchBasesLocalesParams = {
  commune: string;
  page: number;
  limit: number;
  deleted?: number;
};

async function processReponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();
    console.log(error);
    throw new Error(error.message);
  }

  try {
    return await res.json();
  } catch {
    return res;
  }
}

export async function getBaseLocale(
  baseLocaleId: string
): Promise<BaseLocaleType> {
  const res: Response = await fetch(
    `${PROXY_MES_ADRESSES_API}/bases-locales/${baseLocaleId}`
  );
  return processReponse(res);
}

export async function getBaseLocaleIsHabilitationValid(
  baseLocaleId: string
): Promise<boolean> {
  const res: Response = await fetch(
    `${NEXT_PUBLIC_API_MES_ADRESSES}/bases-locales/${baseLocaleId}/habilitation/is-valid`
  );
  return processReponse(res);
}

export async function removeBaseLocale(baseLocaleId: string) {
  const res: Response = await fetch(
    `${PROXY_MES_ADRESSES_API}/bases-locales/${baseLocaleId}`,
    {
      method: "DELETE",
    }
  );
  return processReponse(res);
}

export async function searchBasesLocales(
  query: SearchBasesLocalesParams
): Promise<PageType<BaseLocaleType>> {
  const { page = 1, limit = 20, deleted = false } = query;
  const offset = (page - 1) * limit;
  const params = { ...query, offset, limit, deleted };
  const queryString: string = Object.keys(params)
    .map((key: string) => `${key}=${String(params[key])}`)
    .join("&");

  const res: Response = await fetch(
    `${PROXY_MES_ADRESSES_API}/bases-locales/search?${queryString}`
  );
  return processReponse(res);
}

export async function getStatCreations({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const res = await fetch(
    `${NEXT_PUBLIC_API_MES_ADRESSES}/stats/bals/creations?from=${from}&to=${to}`
  );
  return processReponse(res);
}

export async function createHabilitation(balId: string, token: string) {
  const res = await fetch(
    `${NEXT_PUBLIC_API_MES_ADRESSES}/bases-locales/${balId}/habilitation`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return processReponse(res);
}
