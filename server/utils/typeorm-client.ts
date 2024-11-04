import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { PartenaireDeLaCharte } from "server/lib/partenaire-de-la-charte/entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  schema: "public",
  entities: [PartenaireDeLaCharte],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
