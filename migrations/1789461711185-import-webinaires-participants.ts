import { MigrationInterface, QueryRunner } from "typeorm";
import { ObjectId } from "bson";
import { readFileSync } from "fs";
import { join } from "path";
import { csv2json } from "json-2-csv";

interface WebinaireRow {
  created_at: string;
  community: string;
  fullname: string;
  function: string;
  email: string;
  date: string;
}

interface ParticipantSeed {
  fullname: string;
  community: string | null;
  function: string | null;
  email: string;
  createdAt: Date;
}

const CSV_PATH = join(__dirname, "webinaires.csv");

function toTrimmedString(value: unknown): string {
  return value === null || value === undefined ? "" : String(value).trim();
}

function loadParticipantsByDate(): Map<string, ParticipantSeed[]> {
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const rows = csv2json(csvContent) as WebinaireRow[];

  const byDate = new Map<string, ParticipantSeed[]>();
  const seenPerDate = new Map<string, Set<string>>();

  let skippedMissingDate = 0;
  let skippedMissingEmailOrFullname = 0;
  let skippedDuplicates = 0;

  for (const row of rows) {
    const rawDate = toTrimmedString(row.date);
    if (!rawDate) {
      skippedMissingDate++;
      continue;
    }

    const fullname = toTrimmedString(row.fullname);
    const email = toTrimmedString(row.email);
    if (!fullname || !email) {
      skippedMissingEmailOrFullname++;
      continue;
    }

    const dateKey = rawDate.slice(0, 10);
    const dedupeKey = `${email.toLowerCase()}|${fullname.toLowerCase()}`;

    let seen = seenPerDate.get(dateKey);
    if (!seen) {
      seen = new Set();
      seenPerDate.set(dateKey, seen);
    }
    if (seen.has(dedupeKey)) {
      skippedDuplicates++;
      continue;
    }
    seen.add(dedupeKey);

    const community = toTrimmedString(row.community);
    const fn = toTrimmedString(row.function);
    const rawCreatedAt = toTrimmedString(row.created_at);
    const parsedCreatedAt = rawCreatedAt ? new Date(rawCreatedAt) : new Date();

    const seeds = byDate.get(dateKey) ?? [];
    seeds.push({
      fullname,
      community: community || null,
      function: fn || null,
      email,
      createdAt: Number.isNaN(parsedCreatedAt.getTime())
        ? new Date()
        : parsedCreatedAt,
    });
    byDate.set(dateKey, seeds);
  }

  console.log(
    `[ImportWebinairesParticipants] CSV: ${rows.length} lignes lues, ` +
      `${skippedMissingDate} ignorées (date manquante), ` +
      `${skippedMissingEmailOrFullname} ignorées (email/fullname manquant), ` +
      `${skippedDuplicates} doublons ignorés.`,
  );

  return byDate;
}

export class ImportWebinairesParticipants1789461711185
  implements MigrationInterface
{
  name = "ImportWebinairesParticipants1789461711185";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const participantsByDate = loadParticipantsByDate();

    const events: { id: string; date: string }[] = await queryRunner.query(
      `SELECT id, TO_CHAR(date, 'YYYY-MM-DD') AS date FROM events WHERE date IS NOT NULL`,
    );

    const eventIdsWithParticipants = new Set<string>(
      (await queryRunner.query(`SELECT DISTINCT event_id FROM participants`))
        .map((row: { event_id: string }) => row.event_id),
    );

    let eventsUpdated = 0;
    let participantsInserted = 0;
    const matchedDates = new Set<string>();

    for (const event of events) {
      if (eventIdsWithParticipants.has(event.id)) {
        continue;
      }

      const dateKey = event.date;
      const seeds = participantsByDate.get(dateKey);
      if (!seeds || seeds.length === 0) {
        continue;
      }

      matchedDates.add(dateKey);
      eventsUpdated++;

      for (const seed of seeds) {
        await queryRunner.query(
          `INSERT INTO participants (id, event_id, fullname, community, function, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)`,
          [
            new ObjectId().toHexString(),
            event.id,
            seed.fullname,
            seed.community,
            seed.function,
            seed.email,
            seed.createdAt,
          ],
        );
        participantsInserted++;
      }
    }

    let datesWithoutEvent = 0;
    for (const dateKey of Array.from(participantsByDate.keys())) {
      if (!matchedDates.has(dateKey)) {
        datesWithoutEvent++;
      }
    }

    console.log(
      `[ImportWebinairesParticipants] ${eventsUpdated} events mis à jour, ` +
        `${participantsInserted} participants insérés, ` +
        `${datesWithoutEvent} dates du CSV sans event correspondant (ou event déjà rempli).`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
