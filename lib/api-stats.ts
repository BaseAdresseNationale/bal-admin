export interface StatData<T> {
  id: string;
  name: string;
  value: T;
}

export type BanSourcesStat = Record<string, Record<string, number>>;

export type NbNewAdressesStat = {
  firstDate: string;
  lastDate: string;
  count: number;
};

export type WebinaireStat = {
  type: string;
  date: string;
  nbParticipants: number;
};

export type ZammadMonthlyStat = {
  month: string;
  opened: number;
  closed: number;
  pending: number;
};

export type ZammadStat = {
  months: ZammadMonthlyStat[];
  totalTickets: number;
  totalMessages: number;
};

export interface StatsData {
  firsts_publications?: StatData<Record<string, number>>;
  depot_firsts_publications?: StatData<any>;
  depot_publications?: StatData<any>;
  mes_adresses_bals_creations?: StatData<any>;
  codes_communes_with_ban_errors?: StatData<string[]>;
  blocked_revisions?: StatData<string[]>;
  sources_publication_ban?: StatData<BanSourcesStat>;
  nb_new_adresses?: StatData<NbNewAdressesStat>;
  webinaires?: StatData<WebinaireStat[]>;
  zammad?: StatData<ZammadStat>;
}

export async function getStats(): Promise<StatsData> {
  const response = await fetch("/api/stats");

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}
