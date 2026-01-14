import { schedule } from "node-cron";
import { createStats } from "./service";

const fetchCommunes = async () => {
  const result = await fetch("https://geo.api.gouv.fr/communes");
  return (await result.json()).map((commune) => commune.code);
};

const fetchBanErrors = async (codeCommune) => {
  try {
    const result = await fetch(
      `https://plateforme.adresse.data.gouv.fr/api/alerts/communes/${codeCommune}/status?limit=10`
    );
    return (await result.json()).response;
  } catch (error) {
    console.error(
      `Error fetching ban errors for commune ${codeCommune}:`,
      error
    );
    return [];
  }
};

const calculateStats = async () => {
  const CHUNK_SIZE = 50;
  const codesCommunes = await fetchCommunes();
  let nbCommunesWithBanErrors = 0;
  let nbCommunesStillWithBanErrors = [];
  let nbRevisionsWithBanErrors = 0;
  let nbRevisionsWithWarnings = 0;

  for (let i = 0; i < codesCommunes.length; i += CHUNK_SIZE) {
    const codesCommunesChunk = codesCommunes.slice(i, i + CHUNK_SIZE);
    const datas = await Promise.all(
      codesCommunesChunk.map((codeCommune) => fetchBanErrors(codeCommune))
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) || [];
      if (sortedRevisionsErrors?.[0]?.status === "error") {
        nbCommunesStillWithBanErrors.push(commune.code);
      }
    }
    if (i % CHUNK_SIZE === 0) {
      console.log(`${i}/${codesCommunes.length}`);
    }
  }

  await createStats(
    nbCommunesWithBanErrors,
    nbCommunesStillWithBanErrors,
    nbRevisionsWithBanErrors,
    nbRevisionsWithWarnings
  );
};

export const cronStats = () => {
  calculateStats();
  schedule("0 8 * * *", () => {
    // Cette tâche s'exécute tous les jours à 8h00
    calculateStats();
  });
};
