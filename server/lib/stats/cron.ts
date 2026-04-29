import { schedule } from "node-cron";
import { findAllStats, createOne, deleteOne } from "./service";

const fetchBanErrors = async (codeCommune) => {
  try {
    const result = await fetch(
      `https://plateforme.adresse.data.gouv.fr/api/alerts/communes/${codeCommune}/status?limit=1`,
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
  try {
    const result = await fetch(
      `https://plateforme-bal.adresse.data.gouv.fr/api-depot/current-revisions`,
    );
    return await result.json();
  } catch (error) {
    console.error(`Error fetching BAL errors route /current-revisions:`, error);
    return [];
  }
};

const fetchAndStoreBanSynchroStats = async () => {
  const CHUNK_SIZE = 50;
  // const codesCommunes = await fetchCommunes();
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

export const cronStats = async () => {
  const existingStats = await findAllStats();

  // Lance le calcul uniquement si aucune statistique n'existe
  if (existingStats.length === 0) {
    await fetchAndStoreBanSynchroStats();
    await fetchAndStorePublicationStats();
  } else {
    console.log("Pas de calcul des stats de synchro avec la BAN");
  }

  schedule("0 8 * * *", () => {
    // Cette tâche s'exécute tous les jours à 8h00
    fetchAndStoreBanSynchroStats();
    fetchAndStorePublicationStats();
  });
};
