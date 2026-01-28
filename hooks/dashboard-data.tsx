import { useState, useEffect } from "react";

import { getStats } from "@/lib/api-stats";

interface DashboardData {
  firstPublicationEvolutionResponse: any[];
  publicationsResponse: any[];
  creationsResponse: any[];
  nbCommunesWithBanErrors: number;
  nbCommunesStillWithBanErrors: string[];
  nbRevisionsWithBanErrors: number;
  nbRevisionsWithWarnings: number;
}

const initialDashboardData: DashboardData = {
  firstPublicationEvolutionResponse: [],
  publicationsResponse: [],
  creationsResponse: [],
  nbCommunesWithBanErrors: 0,
  nbCommunesStillWithBanErrors: [],
  nbRevisionsWithBanErrors: 0,
  nbRevisionsWithWarnings: 0,
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
            stats.depot_firsts_publications.value,
          publicationsResponse: stats.depot_publications.value,
          creationsResponse: stats.mes_adresses_bals_creations.value,
          nbCommunesWithBanErrors: stats.nb_communes_with_ban_errors.value || 0,
          nbCommunesStillWithBanErrors:
            stats.nb_communes_still_with_ban_errors.value || [],
          nbRevisionsWithBanErrors:
            stats.nb_revisions_with_ban_errors.value || 0,
          nbRevisionsWithWarnings: stats.nb_revisions_with_warnings.value || 0,
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
