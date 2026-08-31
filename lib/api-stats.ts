export interface StatData<T> {
  id: string;
  name: string;
  value: T;
}

export type BanSourcesStat = Record<string, Record<string, number>>;

export interface StatsData {
  depot_firsts_publications?: StatData<any>;
  depot_publications?: StatData<any>;
  mes_adresses_bals_creations?: StatData<any>;
  codes_communes_with_ban_errors?: StatData<string[]>;
  blocked_revisions?: StatData<string[]>;
  sources_publication_ban?: StatData<BanSourcesStat>;
}

export async function getStats(): Promise<StatsData> {
  const response = await fetch("/api/stats");

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}
