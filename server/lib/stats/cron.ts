import { schedule } from "node-cron";
import { findAllStats, createOne, deleteOne } from "./service";

const fetchCommunes = async () => {
  const result = await fetch("https://geo.api.gouv.fr/communes");
  return (await result.json()).map((commune) => commune.code);
};

const fetchBanErrors = async (codeCommune) => {
  try {
    const result = await fetch(
      `https://plateforme.adresse.data.gouv.fr/api/alerts/communes/${codeCommune}/status?limit=10`,
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

const fetchAndStoreBanSynchroStats = async () => {
  const CHUNK_SIZE = 50;
  const codesCommunes = await fetchCommunes();
  let nbCommunesWithBanErrors = 0;
  let nbCommunesStillWithBanErrors = [];
  let nbRevisionsWithBanErrors = 0;
  let nbRevisionsWithWarnings = 0;

  console.log(
    "CRON: démarage des calculs des statistiques de synchro avec la BAN",
  );
  for (let i = 0; i < codesCommunes.length; i += CHUNK_SIZE) {
    const codesCommunesChunk = codesCommunes.slice(i, i + CHUNK_SIZE);
    const datas = await Promise.all(
      codesCommunesChunk.map((codeCommune) => fetchBanErrors(codeCommune)),
    );

    for (const { revisions_recentes, commune } of datas) {
      const nbRevisionsErrors =
        revisions_recentes?.filter(({ status }) => status === "error") || [];
      nbRevisionsWithBanErrors += nbRevisionsErrors.length;

      const nbRevisionsWarnings =
        revisions_recentes?.filter(({ status }) => status === "warning") || [];
      nbRevisionsWithWarnings += nbRevisionsWarnings.length;

      if (nbRevisionsErrors.length > 0) {
        nbCommunesWithBanErrors++;
      }
      const sortedRevisionsErrors =
        revisions_recentes
          ?.slice()
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ) || [];
      if (sortedRevisionsErrors?.[0]?.status === "error") {
        nbCommunesStillWithBanErrors.push(commune.code);
      }
    }
    if (i % CHUNK_SIZE === 0) {
      console.log(`${i}/${codesCommunes.length}`);
    }
  }
  await deleteOne("nb_communes_with_ban_errors");
  await createOne("nb_communes_with_ban_errors", nbCommunesWithBanErrors);
  await deleteOne("nb_communes_still_with_ban_errors");
  await createOne(
    "nb_communes_still_with_ban_errors",
    nbCommunesStillWithBanErrors,
  );
  await deleteOne("nb_revisions_with_ban_errors");
  await createOne("nb_revisions_with_ban_errors", nbRevisionsWithBanErrors);
  await deleteOne("nb_revisions_with_warnings");
  await createOne("nb_revisions_with_warnings", nbRevisionsWithWarnings);
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
