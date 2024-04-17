import {
  HarvestMoissonneurType,
  OrganizationMoissoneurType,
  PageHarvests,
  SourceMoissoneurType,
  RevisionMoissoneurType,
  AggregateRevisionMoissoneurType,
} from "types/moissoneur";

const NEXT_PUBLIC_API_MOISSONEUR_BAL =
  process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL ||
  "https://plateforme-bal.adresse.data.gouv.fr/moissonneur";
const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";
const PROXY_API_MOISSONNEUR_BAL =
  NEXT_PUBLIC_BAL_ADMIN_URL + "/api/proxy-api-moissonneur-bal";

export async function getFile(id: string): Promise<any> {
  const result: any = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/files/${id}/download`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result;
}

export async function getSources(): Promise<SourceMoissoneurType[]> {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources`);

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getSource(id: string): Promise<SourceMoissoneurType> {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}`);

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getSourcesOrganization(
  id: string
): Promise<SourceMoissoneurType[]> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/organizations/${id}/sources`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getOrganizations(): Promise<
  OrganizationMoissoneurType[]
> {
  const result = await fetch(`${NEXT_PUBLIC_API_MOISSONEUR_BAL}/organizations`);

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getOrganization(
  id: string
): Promise<OrganizationMoissoneurType> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/organizations/${id}`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function updateOrganization(
  id: string,
  changes: Partial<OrganizationMoissoneurType>
): Promise<OrganizationMoissoneurType> {
  const result = await fetch(
    `${PROXY_API_MOISSONNEUR_BAL}/organizations/${id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(changes),
    }
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getHarvest(id: string): Promise<HarvestMoissonneurType> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/harvests/${id}`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getSourceHarvests(
  id: string,
  limit: number,
  page: number = 1
): Promise<PageHarvests> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/harvests?` +
      new URLSearchParams({
        limit: String(limit),
        offset: String(limit * (page - 1)),
      })
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getSourceCurrentRevisions(
  id: string
): Promise<RevisionMoissoneurType[]> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/current-revisions`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getSourceLastUpdatedRevisions(
  id: string
): Promise<AggregateRevisionMoissoneurType[]> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/sources/${id}/last-updated-revisions`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getHarvestRevisions(
  id: string
): Promise<RevisionMoissoneurType[]> {
  const result = await fetch(
    `${NEXT_PUBLIC_API_MOISSONEUR_BAL}/harvests/${id}/revisions`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function harvestSource(
  id: string
): Promise<HarvestMoissonneurType[]> {
  const result = await fetch(
    `${PROXY_API_MOISSONNEUR_BAL}/sources/${id}/harvest`,
    {
      method: "POST",
    }
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function udpateSource(
  id: string,
  changes: Partial<SourceMoissoneurType>
): Promise<SourceMoissoneurType> {
  const result = await fetch(`${PROXY_API_MOISSONNEUR_BAL}/sources/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function publishRevision(
  id: string,
  body: { force: boolean }
): Promise<RevisionMoissoneurType> {
  const result = await fetch(
    `${PROXY_API_MOISSONNEUR_BAL}/revisions/${id}/publish`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}

export async function getRevisionsByCommune(
  codeCommune: string
): Promise<RevisionMoissoneurType[]> {
  const result = await fetch(
    `${PROXY_API_MOISSONNEUR_BAL}/communes/${codeCommune}/revisions`
  );

  if (!result.ok) {
    const error = await result.json();
    throw new Error(error.message);
  }

  return result.json();
}
