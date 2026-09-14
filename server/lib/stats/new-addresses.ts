import { openBanCsvLines } from "./ban-sources";

export interface NbNewAdressesStat {
  firstDate: string;
  lastDate: string;
  count: number;
}

async function countLinesForDate(date: string): Promise<number | null> {
  const rl = await openBanCsvLines(date);
  if (!rl) return null;

  let lineCount = -1; // ne compte pas la ligne d'en-tête

  return new Promise((resolve, reject) => {
    rl.on("line", (line: string) => {
      if (!line) return;
      lineCount++;
    });
    rl.on("close", () => resolve(lineCount));
    rl.on("error", reject);
  });
}

export async function computeNbNewAdresses(
  firstDate: string,
  lastDate: string,
): Promise<number | null> {
  console.log(`CRON: comptage des adresses BAN pour ${firstDate}`);
  const firstCount = await countLinesForDate(firstDate);
  if (firstCount === null) {
    console.warn(`CRON: fichier BAN de référence indisponible pour ${firstDate}`);
    return null;
  }

  console.log(`CRON: comptage des adresses BAN pour ${lastDate}`);
  const lastCount = await countLinesForDate(lastDate);
  if (lastCount === null) {
    console.warn(`CRON: fichier BAN le plus récent indisponible pour ${lastDate}`);
    return null;
  }

  return lastCount - firstCount;
}
