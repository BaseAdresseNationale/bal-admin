import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";

export type BanSourcesStat = Record<string, Record<string, number>>;

const LISTING_URL = "https://adresse.data.gouv.fr/data/ban/adresses";
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

function fileUrlForDate(date: string): string {
  return `${LISTING_URL}/${date}/csv/adresses-france.csv.gz`;
}

export async function fetchAvailableBanDates(): Promise<string[]> {
  const res = await fetch(LISTING_URL);
  if (!res.ok) {
    throw new Error(
      `Impossible de récupérer la liste des dates BAN (HTTP ${res.status})`,
    );
  }
  const html = await res.text();
  const regex = /href="\/data\/ban\/adresses\/(\d{4}-\d{2}-\d{2})"/g;
  const dates = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    dates.add(match[1]);
  }
  const result: string[] = [];
  dates.forEach((date) => result.push(date));
  return result.sort();
}

async function fetchWithRetry(url: string): Promise<Response | null> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt),
        );
      }
    }
  }
  throw lastError;
}

export async function countSourcesForDate(
  date: string,
): Promise<Record<string, number> | null> {
  const url = fileUrlForDate(date);
  const res = await fetchWithRetry(url);
  if (!res || !res.body) {
    console.warn(`CRON: fichier BAN introuvable (404) pour ${date} à ${url}`);
    return null;
  }

  const nodeStream = Readable.fromWeb(res.body as any);
  const rl = createInterface({
    input: nodeStream.pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  let sourceIndex = -1;
  const counts: Record<string, number> = {};

  return new Promise((resolve, reject) => {
    rl.on("line", (line: string) => {
      if (!line) return;
      if (sourceIndex === -1) {
        sourceIndex = line.split(";").indexOf("source_position");
        if (sourceIndex === -1) {
          rl.close();
          reject(
            new Error(
              `Colonne source_position introuvable dans l'en-tête pour ${date}`,
            ),
          );
        }
        return;
      }
      const value = line.split(";")[sourceIndex] || "inconnue";
      counts[value] = (counts[value] || 0) + 1;
    });
    rl.on("close", () => resolve(counts));
    rl.on("error", reject);
  });
}
