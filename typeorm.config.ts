import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { PartenaireDeLaCharte } from "./server/lib/partenaire-de-la-charte/entity";
import { Event } from "./server/lib/events/entity";
import { BalWidget } from "./server/lib/bal-widget/entity";
import { Participant } from "./server/lib/participant/entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  synchronize: false,
  logging: true,
  entities: [PartenaireDeLaCharte, Event, BalWidget, Participant],
  migrationsRun: false,
  migrations: ["./migrations/*.ts"],
});
