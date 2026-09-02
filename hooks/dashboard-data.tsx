import { useState, useEffect } from "react";

import { getStats } from "@/lib/api-stats";

interface DashboardData {
  firstPublicationEvolutionResponse: any[];
  publicationsResponse: any[];
  creationsResponse: any[];
  codesCommunesWithBanErrors: string[];
  blockedRevisions: string[];
  firstsPublications: Record<string, number>;
}

const initialDashboardData: DashboardData = {
  firstPublicationEvolutionResponse: [],
  publicationsResponse: [],
  creationsResponse: [],
  codesCommunesWithBanErrors: [],
  blockedRevisions: [],
  firstsPublications: null,
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
