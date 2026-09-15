import { useState, useEffect } from "react";

import {
  BanSourcesStat,
  NbNewAdressesStat,
  WebinaireStat,
  ZammadStat,
  getStats,
} from "@/lib/api-stats";

interface DashboardData {
  firstPublicationEvolutionResponse: any[];
  publicationsResponse: any[];
  creationsResponse: any[];
  codesCommunesWithBanErrors: string[];
  blockedRevisions: string[];
  firstsPublications: Record<string, number>;
  sourcesPublicationBan: BanSourcesStat;
  nbNewAdresses: NbNewAdressesStat;
  webinaires: WebinaireStat[];
  zammad: ZammadStat;
}

const initialZammadStat: ZammadStat = {
  months: [],
  totalTickets: 0,
  totalMessages: 0,
};

const initialDashboardData: DashboardData = {
  firstPublicationEvolutionResponse: [],
  publicationsResponse: [],
  creationsResponse: [],
  codesCommunesWithBanErrors: [],
  blockedRevisions: [],
  firstsPublications: null,
  sourcesPublicationBan: null,
  nbNewAdresses: null,
  webinaires: [],
  zammad: initialZammadStat,
};

export function useDashboardData() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        const stats = await getStats();

        setDashboardData({
          firstPublicationEvolutionResponse:
            stats.depot_firsts_publications?.value,
          publicationsResponse: stats.depot_publications?.value,
          creationsResponse: stats.mes_adresses_bals_creations?.value,
          codesCommunesWithBanErrors:
            stats.codes_communes_with_ban_errors?.value || [],
          blockedRevisions: stats.blocked_revisions?.value || [],
          firstsPublications: stats.firsts_publications?.value || null,
          sourcesPublicationBan: stats.sources_publication_ban?.value || null,
          nbNewAdresses: stats.nb_new_adresses?.value || null,
          webinaires: stats.webinaires?.value || [],
          zammad: stats.zammad?.value || initialZammadStat,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { dashboardData, isLoading, error };
}
