export interface StatData<T> {
  id: string;
  name: string;
  value: T;
}

export interface StatsData {
  depot_firsts_publications?: StatData<any>;
  depot_publications?: StatData<any>;
  mes_adresses_bals_creations?: StatData<any>;
  nb_communes_with_ban_errors?: StatData<number>;
  nb_communes_still_with_ban_errors?: StatData<string[]>;
  nb_revisions_with_ban_errors?: StatData<number>;
  nb_revisions_with_warnings?: StatData<number>;
}

export async function getStats(): Promise<StatsData> {
  const response = await fetch("/api/stats");

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}
