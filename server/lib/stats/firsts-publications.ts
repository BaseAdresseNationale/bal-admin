import { readFileSync } from "fs";
import { join } from "path";
import { format, addYears, isBefore, startOfMonth, subDays } from "date-fns";

const CSV_PATH = join(process.cwd(), "publication_date.csv");

interface FirstPublicationEntry {
  date: string;
  totalCreations: number;
}

const monthKey = (date: Date): string => format(date, "MM-yyyy");

const loadPublicationDates = (): Date[] => {
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const lines = csvContent.trim().split("\n").slice(1);

  return lines
    .map((line) => line.split(",")[1]?.trim())
    .filter(Boolean)
    .map((rawDate) => new Date(rawDate));
};

const getCsvMonthlyCounts = (): {
  monthlyCounts: Record<string, number>;
  csvMaxMonthKey: string;
} => {
  const publicationDates = loadPublicationDates();
  const monthlyCounts: Record<string, number> = {};
  let csvMaxDate = publicationDates[0];

  for (const date of publicationDates) {
    const key = monthKey(date);
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    if (date > csvMaxDate) {
      csvMaxDate = date;
    }
  }

  return { monthlyCounts, csvMaxMonthKey: monthKey(csvMaxDate) };
};

const fetchFirstsPublicationsRaw = async (
  from: Date,
  to: Date,
): Promise<Map<string, number>> => {
  const depotUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL;
  const depotToken = process.env.API_DEPOT_TOKEN;
  const cumulativeByDate = new Map<string, number>();

  let windowFrom = from;
  while (isBefore(windowFrom, to)) {
    const windowTo = isBefore(addYears(windowFrom, 1), to)
      ? addYears(windowFrom, 1)
      : to;

    const fromParam = format(windowFrom, "yyyy-MM-dd");
    const toParam = format(windowTo, "yyyy-MM-dd");

    const headers: Record<string, string> = {};
    if (depotToken) headers.Authorization = `Bearer ${depotToken}`;

    const response = await fetch(
      `${depotUrl}/stats/firsts-publications?from=${fromParam}&to=${toParam}`,
      { headers },
    );
    const entries: FirstPublicationEntry[] = await response.json();

    for (const { date, totalCreations } of entries) {
      cumulativeByDate.set(date, totalCreations);
    }

    windowFrom = windowTo;
  }

  return cumulativeByDate;
};

const deriveMonthlyDeltasFromCumulative = (
  cumulativeByDate: Map<string, number>,
): Record<string, number> => {
  const sortedDates = Array.from(cumulativeByDate.keys()).sort();
  const lastCumulativeByMonth = new Map<string, number>();

  for (const date of sortedDates) {
    const key = monthKey(new Date(date));
    lastCumulativeByMonth.set(key, cumulativeByDate.get(date));
  }

  const sortedMonthKeys = Array.from(lastCumulativeByMonth.keys()).sort(
    (a, b) =>
      new Date(`${a.slice(3)}-${a.slice(0, 2)}-01`).getTime() -
      new Date(`${b.slice(3)}-${b.slice(0, 2)}-01`).getTime(),
  );

  const monthlyDeltas: Record<string, number> = {};
  let previousCumulative = 0;
  for (const key of sortedMonthKeys) {
    const cumulative = lastCumulativeByMonth.get(key);
    monthlyDeltas[key] = cumulative - previousCumulative;
    previousCumulative = cumulative;
  }

  return monthlyDeltas;
};

export const buildFirstsPublicationsRecord = async (
  from: Date,
  to: Date,
): Promise<Record<string, number>> => {
  // totalCreations is a global cumulative count independent of the query's
  // `from`, so we need the cumulative value of the day right before `from`
  // as a baseline to compute a correct delta for the first month in range.
  const cumulativeByDate = await fetchFirstsPublicationsRaw(
    subDays(from, 1),
    to,
  );
  const apiMonthlyDeltas = deriveMonthlyDeltasFromCumulative(cumulativeByDate);
  const { monthlyCounts: csvMonthlyCounts, csvMaxMonthKey } =
    getCsvMonthlyCounts();
  const csvMaxMonthStart = new Date(
    `${csvMaxMonthKey.slice(3)}-${csvMaxMonthKey.slice(0, 2)}-01`,
  );
  const rangeStart = startOfMonth(from);

  const result: Record<string, number> = {};
  for (const key of Object.keys(apiMonthlyDeltas)) {
    const monthStart = new Date(`${key.slice(3)}-${key.slice(0, 2)}-01`);
    if (isBefore(monthStart, rangeStart)) continue;

    result[key] = isBefore(monthStart, csvMaxMonthStart)
      ? (csvMonthlyCounts[key] ?? 0)
      : apiMonthlyDeltas[key];
  }

  return result;
};

export const getLatestMonthStart = (record: Record<string, number>): Date => {
  const monthStarts = Object.keys(record).map(
    (key) => new Date(`${key.slice(3)}-${key.slice(0, 2)}-01`),
  );
  const latest = monthStarts.reduce((max, current) =>
    current > max ? current : max,
  );
  return startOfMonth(latest);
};

export const FIRSTS_PUBLICATIONS_BACKFILL_FROM = new Date(2014, 0, 1);
