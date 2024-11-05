import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "bson";

export enum PartenaireDeLaCharteServiceEnum {
  FORMATION = "formation",
  ACCOMPAGNEMENT_TECNIQUE = "accompagnement technique",
  REALISATION_DE_BASES_ADRESSES_LOCALES = "réalisation de bases adresses locales",
  MISE_A_DISPOSITION_D_OUTILS_MUTUALISES = "mise à disposition d'outils mutualisés",
  PARTAGE_D_EXPERIENCE = "partage d'expérience",
}

export enum PartenaireDeLaCharteTypeEnum {
  COMMUNE = "commune",
  ENTREPRISE = "entreprise",
  ORGANISME = "organisme",
}

export enum PartenaireDeLaCharteOrganismeTypeEnum {
  EPCI = "epci",
  DEPARTEMENT = "departement",
  REGION = "region",
  AUTRE = "autre",
}

@Entity({ name: "partenaire_de_la_charte" })
export class PartenaireDeLaCharte {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @BeforeInsert()
  generatedObjectId?() {
    this.id = new ObjectId().toHexString();
  }

  @Column("text", { nullable: false })
  name: string;

  @Column("text", { nullable: true })
  picture: string;

  @Column("text", { nullable: false, name: "contact_last_name" })
  contactLastName: string;

  @Column("text", { nullable: false, name: "contact_first_name" })
  contactFirstName: string;

  @Column("text", { nullable: false, name: "contact_email" })
  contactEmail: string;

  @Column("enum", {
    enum: PartenaireDeLaCharteTypeEnum,
    default: PartenaireDeLaCharteTypeEnum.COMMUNE,
    nullable: false,
  })
  type: PartenaireDeLaCharteTypeEnum;

  @Column("text", { nullable: true })
  charteURL: string;

  @Column("text", { nullable: true })
  link: string;

  @Column("text", { nullable: true, array: true, name: "code_departement" })
  codeDepartement: string[];

  @Column("enum", {
    enum: PartenaireDeLaCharteServiceEnum,
    nullable: false,
    array: true,
  })
  services: PartenaireDeLaCharteServiceEnum[];

  @Column("text", {
    nullable: true,
    array: true,
    name: "datagouv_organization_id",
  })
  dataGouvOrganizationId: string[];

  @Column("text", { nullable: true, array: true, name: "api_depot_client_id" })
  apiDepotClientId: string[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp", { nullable: true, name: "signature_date" })
  signatureDate: Date;

  // COMMUNE

  @Column("text", { nullable: true, name: "code_region" })
  codeRegion: string;

  @Column("text", { nullable: true, name: "code_commune" })
  codeCommune: string;

  @Column("text", { nullable: true })
  testimonyURL: string;

  @Column("text", { nullable: true })
  balURL: string;

  // ORGANISME

  @Column("enum", {
    enum: PartenaireDeLaCharteOrganismeTypeEnum,
    nullable: true,
    name: "orgnisme_type",
  })
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum;

  @Column("text", { nullable: true })
  infos: string;

  @Column("text", { nullable: true })
  perimeter: string;

  // ENTRPRISE

  @Column("boolean", { nullable: true, name: "is_petimeter_france" })
  isPerimeterFrance: boolean;
}
