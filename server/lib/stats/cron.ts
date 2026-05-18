import { schedule } from "node-cron";
import { findAllStats, createOne, deleteOne } from "./service";
import { Revision, StatusRevisionEnum } from "../../../types/api-depot.types";

export type RevisionLast = Pick<
  Revision,
  "id" | "codeCommune" | "isReady" | "status"
> & { isValid: boolean };

const fetchBanErrors = async (codeCommune) => {
  const banURL = process.env.NEXT_PUBLIC_API_BAN_URL;
  if (!banURL) {
    console.warn(
      "Variable d'environnement NEXT_PUBLIC_API_BAN_URL manquante : impossible de récupérer les alerts BAN",
    );
    return [];
  }
  try {
    const result = await fetch(
      `${banURL}/api/alerts/communes/${codeCommune}/status?limit=1`,
    );
    return (await result.json()).response;
  } catch (error) {
    console.error(
      `Error fetching ban errors for commune ${codeCommune}:`,
      error,
    );
    return [];
  }
};

const fetchCurrentRevisions = async () => {
  const depotUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL;
  if (!depotUrl) {
    console.warn(
      "Variable d'environnement NEXT_PUBLIC_API_DEPOT_URL manquante : impossible de récupérer les révisions courantes",
    );
    return [];
  }
  try {
    const result = await fetch(`${depotUrl}/current-revisions`);
    return await result.json();
  } catch (error) {
    console.error(`Error fetching BAL errors route /current-revisions:`, error);
    return [];
  }
};

const fetchLastRevisions = async () => {
  const depotUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL;
  if (!depotUrl) {
    console.warn(
      "Variable d'environnement NEXT_PUBLIC_API_DEPOT_URL manquante : impossible de récupérer les dernières révisions",
    );
    return [];
  }
  try {
    const result = await fetch(`${depotUrl}/last-revisions`);
    return await result.json();
  } catch (error) {
    console.error(`Error fetching BAL errors route /last-revisions:`, error);
    return [];
  }
};

const fetchAndStoreBlockedRevisionsStats = async () => {
  const lastRevisions: RevisionLast[] = await fetchLastRevisions();
  let blockedRevisions: string[] = [];

  console.log("CRON: démarage des calculs des statistiques des BAL bloquées");
  for (const revision of lastRevisions) {
    if (
      revision.status === StatusRevisionEnum.PENDING &&
      (revision.isValid === false || revision.isReady)
    ) {
      blockedRevisions.push(revision.id);
    }
  }
  await deleteOne("blocked_revisions");
  await createOne("blocked_revisions", blockedRevisions);
  console.log("CRON: fin des calculs des statistique de synchro avec la BAN");
};

const fetchAndStoreBanSynchroStats = async () => {
  const CHUNK_SIZE = 50;
  const currentRevisions = await fetchCurrentRevisions();
  let codesCommunesWithBanErrors: string[] = [];

  console.log(
    "CRON: démarage des calculs des statistiques de synchro avec la BAN",
  );
  for (let i = 0; i < currentRevisions.length; i += CHUNK_SIZE) {
    const codesCommunesChunk = currentRevisions
      .slice(i, i + CHUNK_SIZE)
      .map(({ codeCommune }) => codeCommune);
    const datas = await Promise.all(
      codesCommunesChunk.map((codeCommune) => fetchBanErrors(codeCommune)),
    );

    for (let j = 0; j < CHUNK_SIZE && j + i < currentRevisions.length; j++) {
      const currentRevision = currentRevisions[i + j];
      const alertsCommune = datas.find(
        ({ commune }) =>
          commune && commune.code === currentRevision.codeCommune,
      );
      const alertsLastRevision = alertsCommune?.revisions_recentes?.[0];
      if (
        alertsLastRevision &&
        (alertsLastRevision.revisionId !== currentRevision.id ||
          alertsLastRevision.status === "error")
      ) {
        codesCommunesWithBanErrors.push(currentRevision.codeCommune);
      }
    }
    if (i % CHUNK_SIZE === 0) {
      console.log(`${i}/${currentRevisions.length}`);
    }
  }
  await deleteOne("codes_communes_with_ban_errors");
  await createOne("codes_communes_with_ban_errors", codesCommunesWithBanErrors);
  console.log("CRON: fin des calculs des statistique de synchro avec la BAN");
};

const fetchAndStorePublicationStats = async () => {
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  const fromDate = new Date(today);
  fromDate.setFullYear(fromDate.getFullYear() - 1);
  const from = fromDate.toISOString().split("T")[0];

  const depotUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL;
  const mesAdressesUrl = process.env.NEXT_PUBLIC_API_MES_ADRESSES;

  if (!depotUrl || !mesAdressesUrl) {
    console.warn(
      "Variables d'environnement NEXT_PUBLIC_API_DEPOT_URL ou NEXT_PUBLIC_API_MES_ADRESSES manquantes : impossible de récupérer les stats de publications",
    );
    return;
  }

  try {
    console.log(
      `CRON: récupération des stats de publications ${from} -> ${to}`,
    );

    const depotToken = process.env.API_DEPOT_TOKEN;

    const urls = [
      `${depotUrl}/stats/firsts-publications?from=${from}&to=${to}`,
      `${depotUrl}/stats/publications?from=${from}&to=${to}`,
      `${mesAdressesUrl}/stats/bals/creations?from=${from}&to=${to}`,
    ];

    const responses = await Promise.all(
      urls.map((u) => {
        if (u.startsWith(depotUrl)) {
          const headers: Record<string, string> = {};
          if (depotToken) headers.Authorization = `Bearer ${depotToken}`;
          return fetch(u, { headers }).then((r) => r.json());
        }
        return fetch(u).then((r) => r.json());
      }),
    );

    const [firstsRes, pubsRes, balsRes] = responses;

    await deleteOne("depot_firsts_publications");
    await createOne("depot_firsts_publications", firstsRes);
    await deleteOne("depot_publications");
    await createOne("depot_publications", pubsRes);
    await deleteOne("mes_adresses_bals_creations");
    await createOne("mes_adresses_bals_creations", balsRes);

    console.log("CRON: stats de publications enregistrées");
  } catch (error) {
    console.error(
      "Erreur lors de la récupération/enregistrement des stats de publications :",
      error,
    );
  }
};

const calculStats = async () => {
  try {
    await fetchAndStoreBlockedRevisionsStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul initial des dernieres révisions en pending :",
      error,
    );
  }

  try {
    await fetchAndStoreBanSynchroStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul initial des stats BAN synchro :",
      error,
    );
  }

  try {
    await fetchAndStorePublicationStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul initial des stats publications :",
      error,
    );
  }
};

export const cronStats = async () => {
  const existingStats = await findAllStats();
  // Lance le calcul uniquement si aucune statistique n'existe
  if (existingStats.length === 0) {
    console.log("Calcul des stats");
    calculStats();
  }
  schedule("0 8 * * *", async () => {
    // Cette tâche s'exécute tous les jours à 8h00
    calculStats();
  });
};
