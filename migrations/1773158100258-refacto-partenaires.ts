import { MigrationInterface, QueryRunner } from "typeorm";
import { ObjectId } from "bson";
import { Client, ChefDeFile } from "../types/api-depot.types";

type MoissonneurPerimeter = {
  type: "commune" | "departement" | "epci";
  code: string;
};
type MoissonneurOrganization = {
  id: string;
  name: string;
  perimeters: MoissonneurPerimeter[];
  deletedAt: Date;
};

const MOISSONNEUR_BAL_URL =
  process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL ||
  "https://plateforme-bal.adresse.data.gouv.fr/moissonneur";

const API_DEPOT_URL =
  process.env.NEXT_PUBLIC_API_DEPOT_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";

async function fetchApiDepotClients(): Promise<Client[]> {
  const response = await fetch(`${API_DEPOT_URL}/clients`);
  if (!response.ok) {
    throw new Error(`Failed to fetch API Depot clients: ${response.status}`);
  }
  return response.json();
}

async function fetchChefsDeFile(): Promise<Map<string, ChefDeFile>> {
  const response = await fetch(`${API_DEPOT_URL}/chefs-de-file`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chefs de file: ${response.status}`);
  }
  const chefsDeFile: ChefDeFile[] = await response.json();
  return new Map(chefsDeFile.map((cdf) => [cdf.id, cdf]));
}

async function migrateApiDepotClients(
  queryRunner: QueryRunner,
  partenaires: { id: string; api_depot_client_id: string[] | null }[],
): Promise<void> {
  const apiDepotClients = await fetchApiDepotClients();
  const chefsDeFile = await fetchChefsDeFile();
  // Build a map of clientId → partenaireId for quick lookup
  const clientIdToPartenaireId = new Map<string, string>();
  for (const partenaire of partenaires) {
    for (const clientId of partenaire.api_depot_client_id ?? []) {
      clientIdToPartenaireId.set(clientId, partenaire.id);
    }
  }

  for (const apiDepotClient of apiDepotClients) {
    const newClientId = new ObjectId().toHexString();
    const partenaireId = clientIdToPartenaireId.get(apiDepotClient.id) ?? null;
    await queryRunner.query(
      `INSERT INTO clients (id, name, client_id, partenaire_id, type, deleted_at) VALUES ($1, $2, $3, $4, 'api-depot', $5)`,
      [
        newClientId,
        apiDepotClient.nom,
        apiDepotClient.id,
        partenaireId,
        apiDepotClient.isActive ? null : new Date(),
      ],
    );

    const chefDeFile = apiDepotClient.chefDeFileId
      ? chefsDeFile.get(apiDepotClient.chefDeFileId)
      : undefined;

    for (const perimeter of chefDeFile?.perimeters ?? []) {
      await queryRunner.query(
        `INSERT INTO perimeters (id, client_id, type, code) VALUES ($1, $2, $3, $4)`,
        [
          new ObjectId().toHexString(),
          newClientId,
          perimeter.type,
          perimeter.code,
        ],
      );
    }
  }
}

async function fetchMoissonneurOrganizations(): Promise<
  MoissonneurOrganization[]
> {
  const response = await fetch(`${MOISSONNEUR_BAL_URL}/organizations`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch moissonneur organizations: ${response.status}`,
    );
  }
  return response.json();
}

async function migrateMoissonneurClients(
  queryRunner: QueryRunner,
  partenaires: { id: string; datagouv_organization_id: string[] | null }[],
): Promise<void> {
  const organizations = await fetchMoissonneurOrganizations();

  // Build a map of orgId → partenaireId for quick lookup
  const orgIdToPartenaireId = new Map<string, string>();
  for (const partenaire of partenaires) {
    for (const orgId of partenaire.datagouv_organization_id ?? []) {
      orgIdToPartenaireId.set(orgId, partenaire.id);
    }
  }

  for (const organization of organizations) {
    const newClientId = new ObjectId().toHexString();
    const partenaireId = orgIdToPartenaireId.get(organization.id) ?? null;

    await queryRunner.query(
      `INSERT INTO clients (id, name, client_id, partenaire_id, type, deleted_at) VALUES ($1, $2, $3, $4, 'moissonneur-bal', $5)`,
      [
        newClientId,
        organization.name,
        organization.id,
        partenaireId,
        organization.deletedAt,
      ],
    );

    for (const perimeter of organization.perimeters ?? []) {
      await queryRunner.query(
        `INSERT INTO perimeters (id, client_id, type, code) VALUES ($1, $2, $3, $4)`,
        [
          new ObjectId().toHexString(),
          newClientId,
          perimeter.type,
          perimeter.code,
        ],
      );
    }
  }
}

export class RefactoPartenaires1773158100258 implements MigrationInterface {
  name = "RefactoPartenaires1773158100258";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CREATE PERIMETRE
    await queryRunner.query(
      `CREATE TYPE "public"."perimeters_type_enum" AS ENUM('commune', 'departement', 'epci')`,
    );
    await queryRunner.query(
      `CREATE TABLE "perimeters" ("id" character varying(24) NOT NULL, "client_id" character varying(24) NOT NULL, "type" "public"."perimeters_type_enum" NOT NULL, "code" text NOT NULL, CONSTRAINT "PK_812f0b99b15bb4dbab4e807b24d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_perimeters_client_id" ON "perimeters" ("client_id") `,
    );
    // CREATE CLIENT
    await queryRunner.query(
      `CREATE TYPE "public"."clients_type_enum" AS ENUM('api-depot', 'moissonneur-bal')`,
    );
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" character varying(24) NOT NULL, "name" text NOT NULL, "client_id" character varying(24) NOT NULL, "partenaire_id" character varying(24), "type" "public"."clients_type_enum" NOT NULL DEFAULT 'api-depot', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_clients_client_id" ON "clients" ("client_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_clients_partenaire_id" ON "clients" ("partenaire_id") `,
    );
    // AJOUT CONTRAITE PERIMETRE / CLIENT / PARTENAIRE
    await queryRunner.query(
      `ALTER TABLE "perimeters" ADD CONSTRAINT "FK_e60a1314a165bd013701fa3d080" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_27155f00a46c225c1f44027ed96" FOREIGN KEY ("partenaire_id") REFERENCES "partenaires_de_la_charte"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // REMPLIR CLIENT ET PERIMETRE
    const partenaires: {
      id: string;
      type: "commune" | "entreprise" | "organisme";
      organisme_type: "epci" | "departement" | "region" | "autre" | null;
      api_depot_client_id: string[] | null;
      datagouv_organization_id: string[] | null;
      code_departement: string[] | null;
      code_commune: string | null;
      perimeter: string | null;
    }[] = await queryRunner.query(`
      SELECT
        id,
        type,
        organisme_type,
        api_depot_client_id,
        datagouv_organization_id,
        code_departement,
        code_commune,
        perimeter
      FROM partenaires_de_la_charte
      WHERE deleted_at IS NULL
    `);
    // on recupère les client de l'api-depot avec chef de file
    // On créer les clients avec leurs périmètre
    // On link les client au partenaire
    await migrateApiDepotClients(queryRunner, partenaires);

    // on recupère les organisations moissonner
    // On créer les clients avec leurs périmètre
    // On link les client au partenaire
    await migrateMoissonneurClients(queryRunner, partenaires);

    // MODIFICATION PARTENAIRE
    // RENOMAGE
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "link" TO "web_site_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "code_departement" TO "cover_departement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "signature_date" TO "charte_signature_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "code_commune" TO "commune_code_insee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "bal_url" TO "commune_bal_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "infos" TO "organisme_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" RENAME "is_perimeter_france" TO "entreprise_is_perimeter_france"`,
    );
    // SUPPRESSION
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" DROP COLUMN "datagouv_organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" DROP COLUMN "api_depot_client_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" DROP COLUMN "code_region"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" DROP COLUMN "testimony_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" DROP COLUMN "perimeter"`,
    );
    // AJOUT
    await queryRunner.query(
      `ALTER TABLE "partenaires_de_la_charte" ADD "siret" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
