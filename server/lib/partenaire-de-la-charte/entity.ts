import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Review } from "./reviews/entity";

export enum PartenaireDeLaCharteServiceEnum {
  FORMATION = "formation",
  ACCOMPAGNEMENT_TECNIQUE = "accompagnement technique",
  REALISATION_DE_BASES_ADRESSES_LOCALES = "réalisation de bases adresses locales",
  MISE_A_DISPOSITION_D_OUTILS_MUTUALISES = "mise à disposition d'outils mutualisés",
  SENSIBILISATION = "sensibilisation",
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

@Entity({ name: "partenaires_de_la_charte" })
export class PartenaireDeLaCharte {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("text", { nullable: false })
  name: string;

  @Column("text", { nullable: true })
  picture?: string;

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

  @Column("text", { nullable: true, name: "charte_url" })
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

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @Column("timestamp", { nullable: true, name: "signature_date" })
  signatureDate: Date;

  // COMMUNE

  @Column("text", { nullable: true, name: "code_region" })
  codeRegion: string;

  @Column("text", { nullable: true, name: "code_commune" })
  codeCommune: string;

  @Column("text", { nullable: true, name: "testimony_url" })
  testimonyURL: string;

  @Column("text", { nullable: true, name: "bal_url" })
  balURL: string;

  // ORGANISME

  @Column("enum", {
    enum: PartenaireDeLaCharteOrganismeTypeEnum,
    nullable: true,
    name: "organisme_type",
  })
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum;

  @Column("text", { nullable: true })
  infos: string;

  @Column("text", { nullable: true })
  perimeter: string;

  // ENTREPRISE

  @Column("boolean", { nullable: true, name: "is_perimeter_france" })
  isPerimeterFrance: boolean;

  @OneToMany(() => Review, (review) => review.partenaire, { eager: true })
  reviews?: Relation<Review>[];
}
