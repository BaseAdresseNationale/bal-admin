import { schedule } from "node-cron";
import {
  findAllStats,
  findOneByName,
  createOne,
  updateOne,
  deleteOne,
} from "./service";
import { Revision, StatusRevisionEnum } from "../../../types/api-depot.types";
import {
  buildFirstsPublicationsRecord,
  getLatestMonthStart,
  FIRSTS_PUBLICATIONS_BACKFILL_FROM,
} from "./firsts-publications";
import {
  BanSourcesStat,
  fetchAvailableBanDates,
  countSourcesForDate,
} from "./ban-sources";
import { NbNewAdressesStat, computeNbNewAdresses } from "./new-addresses";
import { fetchAllZammadTickets, computeZammadStat } from "./zammad";

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

const fetchAndStoreFirstsPublicationsStats = async () => {
  const depotUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL;
  if (!depotUrl) {
    console.warn(
      "Variable d'environnement NEXT_PUBLIC_API_DEPOT_URL manquante : impossible de récupérer les stats de premières publications",
    );
    return;
  }

  console.log(
    "CRON: démarrage des calculs des statistiques des premières publications",
  );

  const existingStats = await findAllStats();
  const existingStat = existingStats.find(
    ({ name }) => name === "firsts_publications",
  );

  const from = existingStat
    ? getLatestMonthStart(existingStat.value as Record<string, number>)
    : FIRSTS_PUBLICATIONS_BACKFILL_FROM;

  const newRecord = await buildFirstsPublicationsRecord(from, new Date());

  const mergedRecord = {
    ...((existingStat?.value as Record<string, number>) || {}),
    ...newRecord,
  };

  await deleteOne("firsts_publications");
  await createOne("firsts_publications", mergedRecord);

  console.log("CRON: stats de premières publications enregistrées");
};

const fetchAndStoreBanSourcesStats = async () => {
  console.log(
    "CRON: démarrage du calcul des stats de sources de publication BAN",
  );

  const existingStat = await findOneByName("sources_publication_ban");
  const currentValue: BanSourcesStat =
    (existingStat?.value as BanSourcesStat) || {};
  let statInitialized = Boolean(existingStat);

  const availableDates = await fetchAvailableBanDates();
  const missingDates = availableDates.filter((date) => !(date in currentValue));

  if (missingDates.length === 0) {
    console.log("CRON: aucune nouvelle date BAN à traiter");
    return;
  }

  console.log(`CRON: ${missingDates.length} date(s) BAN à traiter`);

  for (const date of missingDates) {
    const counts = await countSourcesForDate(date);
    if (!counts) continue;

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (total === 0) {
      console.warn(
        `CRON: fichier BAN vide ou corrompu pour ${date}, date ignorée`,
      );
      continue;
    }

    currentValue[date] = counts;
    if (statInitialized) {
      await updateOne("sources_publication_ban", currentValue);
    } else {
      await createOne("sources_publication_ban", currentValue);
      statInitialized = true;
    }
    console.log(
      `CRON: date ${date} ajoutée aux stats de sources de publication BAN`,
    );
  }

  console.log("CRON: fin du calcul des stats de sources de publication BAN");
};

const fetchAndStoreNbNewAdressesStats = async () => {
  console.log("CRON: démarrage du calcul du nombre de nouvelles adresses BAN");

  const availableDates = await fetchAvailableBanDates();
  if (availableDates.length < 2) {
    console.warn(
      "CRON: pas assez de dates BAN disponibles pour calculer nb_new_adresses",
    );
    return;
  }
  const firstDate = availableDates[0];
  const lastDate = availableDates[availableDates.length - 1];

  const existingStat = await findOneByName("nb_new_adresses");
  const existingValue = existingStat?.value as NbNewAdressesStat | undefined;

  if (existingValue?.lastDate === lastDate) {
    console.log("CRON: nb_new_adresses déjà à jour, aucun recalcul nécessaire");
    return;
  }

  const count = await computeNbNewAdresses(firstDate, lastDate);
  if (count === null) {
    console.warn(
      "CRON: calcul de nb_new_adresses impossible (fichier(s) BAN indisponible(s))",
    );
    return;
  }

  const value: NbNewAdressesStat = { firstDate, lastDate, count };
  if (existingStat) {
    await updateOne("nb_new_adresses", value);
  } else {
    await createOne("nb_new_adresses", value);
  }

  console.log(
    `CRON: nb_new_adresses mis à jour (${count} nouvelles adresses entre ${firstDate} et ${lastDate})`,
  );
};

const fetchAndStoreZammadStats = async () => {
  console.log("CRON: démarrage du calcul des stats Zammad");

  const tickets = await fetchAllZammadTickets();
  const value = computeZammadStat(tickets);

  await deleteOne("zammad");
  await createOne("zammad", value);

  console.log(
    `CRON: stats Zammad enregistrées (${value.months.length} mois, ${value.totalTickets} ticket(s), ${value.totalMessages} message(s))`,
  );
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
    await fetchAndStoreFirstsPublicationsStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul des stats de premières publications :",
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

  try {
    await fetchAndStoreBanSourcesStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul des stats de sources de publication BAN :",
      error,
    );
  }

  try {
    await fetchAndStoreNbNewAdressesStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul des stats de nouvelles adresses BAN :",
      error,
    );
  }

  try {
    await fetchAndStoreZammadStats();
  } catch (error) {
    console.error("Erreur lors du calcul des stats Zammad :", error);
  }
};

// Stats calculées à la volée dans findAllStats (jamais persistées en base) :
// à exclure du test "aucune statistique n'existe encore" ci-dessous, sans
// quoi il ne se déclencherait plus jamais.
const LIVE_COMPUTED_STAT_NAMES = ["partenaires", "webinaires"];

export const cronStats = async () => {
  const existingStats = await findAllStats();
  const storedStats = existingStats.filter(
    ({ name }) => !LIVE_COMPUTED_STAT_NAMES.includes(name),
  );
  // Lance le calcul uniquement si aucune statistique n'existe
  if (storedStats.length === 0) {
    console.log("Calcul des stats");
    calculStats();
  }
  if (!existingStats.find(({ name }) => name === "firsts_publications")) {
    try {
      await fetchAndStoreFirstsPublicationsStats();
    } catch (error) {
      console.error(
        "Erreur lors du calcul des stats de premières publications :",
        error,
      );
    }
  }
  try {
    await fetchAndStoreBanSourcesStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul des stats de sources de publication BAN :",
      error,
    );
  }
  try {
    await fetchAndStoreNbNewAdressesStats();
  } catch (error) {
    console.error(
      "Erreur lors du calcul des stats de nouvelles adresses BAN :",
      error,
    );
  }
  if (!existingStats.find(({ name }) => name === "zammad")) {
    try {
      await fetchAndStoreZammadStats();
    } catch (error) {
      console.error("Erreur lors du calcul des stats Zammad :", error);
    }
  }
  schedule("0 8 * * *", async () => {
    // Cette tâche s'exécute tous les jours à 8h00
    calculStats();
  });
};
