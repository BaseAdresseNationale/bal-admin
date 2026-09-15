import { AppDataSource } from "../../utils/typeorm-client";
import { EventTypeEnum } from "../events/entity";

export type WebinaireStat = {
  type: string;
  date: string;
  nbParticipants: number;
};

const WEBINAIRE_EVENT_TYPES = [
  EventTypeEnum.FORMATION,
  EventTypeEnum.FORMATION_LVL2,
  EventTypeEnum.FORMATION_SPECIALE,
  EventTypeEnum.PARTENAIRE,
];

export async function computeWebinairesStat(): Promise<WebinaireStat[]> {
  return AppDataSource.query(
    `SELECT e.type AS type,
            TO_CHAR(e.date, 'YYYY-MM-DD') AS date,
            COUNT(p.id)::int AS "nbParticipants"
     FROM events e
     LEFT JOIN participants p ON p.event_id = e.id
     WHERE e.type = ANY($1)
       AND e.date IS NOT NULL
     GROUP BY e.id, e.type, e.date
     ORDER BY e.date`,
    [WEBINAIRE_EVENT_TYPES],
  );
}
