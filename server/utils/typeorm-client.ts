import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { PartenaireDeLaCharte } from "../lib/partenaire-de-la-charte/entity";
import { BalWidget } from "../lib/bal-widget/entity";
import { Event } from "../lib/events/entity";
import { Participant } from "../lib/participant/entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  schema: "public",
  entities: [PartenaireDeLaCharte, BalWidget, Event, Participant],
});
