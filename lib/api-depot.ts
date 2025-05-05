import {
  ChefDeFile,
  Client,
  Mandataire,
  Revision,
} from "types/api-depot.types";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";
const NEXT_PUBLIC_API_DEPOT_URL =
  process.env.NEXT_PUBLIC_API_DEPOT_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";
const PROXY_API_DEPOT_URL = NEXT_PUBLIC_BAL_ADMIN_URL + "/api/proxy-api-depot";
const PROXY_API_DEPOT_DEMO_URL =
  NEXT_PUBLIC_BAL_ADMIN_URL + "/api/proxy-api-depot-demo";

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

function getProxyURL(isDemo: boolean = false): string {
  return isDemo ? PROXY_API_DEPOT_DEMO_URL : PROXY_API_DEPOT_URL;
}

export async function getClient(clientId, isDemo): Promise<Client> {
  const response = await fetch(`${getProxyURL(isDemo)}/clients/${clientId}`);

  return processResponse(response);
}

export async function updateClient(
  clientId: string,
  body: Partial<Client>,
  isDemo: boolean = false
): Promise<Client> {
  const response = await fetch(`${getProxyURL(isDemo)}/clients/${clientId}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  return processResponse(response);
}

export async function createClient(
  body: Partial<Client>,
  isDemo: boolean = false
): Promise<Client> {
  const response = await fetch(`${getProxyURL(isDemo)}/clients`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  return processResponse(response);
}

export async function getClients(isDemo: boolean = false): Promise<Client[]> {
  const response = await fetch(`${getProxyURL(isDemo)}/clients`);

  return processResponse(response);
}

export async function createMandataire(
  body: Partial<Mandataire>,
  isDemo: boolean = false
): Promise<Mandataire> {
  const response = await fetch(`${getProxyURL(isDemo)}/mandataires`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  return processResponse(response);
}

export async function getMandataire(
  mandataireId: string,
  isDemo: boolean = false
): Promise<Mandataire> {
  const response = await fetch(
    `${getProxyURL(isDemo)}/mandataires/${mandataireId}`
  );

  return processResponse(response);
}

export async function getMandataires(
  isDemo: boolean = false
): Promise<Mandataire[]> {
  const response = await fetch(`${getProxyURL(isDemo)}/mandataires`);

  return processResponse(response);
}

export async function createChefDeFile(
  body: Partial<ChefDeFile>,
  isDemo: boolean = false
): Promise<ChefDeFile> {
  const response = await fetch(`${getProxyURL(isDemo)}/chefs-de-file`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  return processResponse(response);
}

export async function updateChefDeFile(
  chefDeFileId: string,
  body: Partial<ChefDeFile>,
  isDemo: boolean = false
): Promise<ChefDeFile> {
  const response = await fetch(
    `${getProxyURL(isDemo)}/chefs-de-file/${chefDeFileId}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return processResponse(response);
}

export async function getChefDeFile(
  chefDeFileId: string,
  isDemo: boolean = false
): Promise<ChefDeFile> {
  const response = await fetch(
    `${getProxyURL(isDemo)}/chefs-de-file/${chefDeFileId}`
  );

  return processResponse(response);
}

export async function getChefsDeFile(
  isDemo: boolean = false
): Promise<ChefDeFile[]> {
  const response = await fetch(`${getProxyURL(isDemo)}/chefs-de-file`);

  return processResponse(response);
}

export async function getStatFirstPublicationEvolution(
  { from, to }: { from: string; to: string },
  isDemo: boolean = false
) {
  const res = await fetch(
    `${getProxyURL(isDemo)}/stats/firsts-publications?from=${from}&to=${to}`
  );

  if (res.ok) {
    return res.json();
  }
}

export async function getStatPublications(
  { from, to }: { from: string; to: string },
  isDemo: boolean = false
) {
  const res = await fetch(
    `${getProxyURL(isDemo)}/stats/publications?from=${from}&to=${to}`
  );

  if (res.ok) {
    return res.json();
  }
}

export async function getAllRevisionByCommune(
  codeCommune: string,
  isDemo: boolean = false
): Promise<Revision[]> {
  const response = await fetch(
    `${getProxyURL(
      isDemo
    )}/communes/${codeCommune}/revisions?status=all&ancienneCommuneAllowed=true`
  );

  return processResponse(response);
}

export async function validateHabilitation(
  habilitationId: string,
  isDemo: boolean = false
) {
  const response = await fetch(
    `${getProxyURL(isDemo)}/habilitations/${habilitationId}/validate`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
    }
  );

  return processResponse(response);
}

export async function getEmailsCommune(codeCommune: string) {
  const response = await fetch(
    `${NEXT_PUBLIC_API_DEPOT_URL}/communes/${codeCommune}/emails`,
    {
      method: "GET",
      headers: { "content-type": "application/json" },
    }
  );

  return processResponse(response);
}
