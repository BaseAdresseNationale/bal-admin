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
import { Client } from "./clients/entity";

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
  siret: string;

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

  @Column("enum", {
    enum: PartenaireDeLaCharteServiceEnum,
    nullable: false,
    array: true,
  })
  services: PartenaireDeLaCharteServiceEnum[];

  @Column("text", { nullable: true, name: "web_site_url" })
  webSiteURL: string;

  @Column("text", { nullable: true, array: true, name: "cover_departement" })
  coverDepartement: string[];

  // CHARTE

  @Column("text", { nullable: true, name: "charte_url" })
  charteURL: string;

  @Column("timestamp", { nullable: true, name: "charte_signature_date" })
  charteSignatureDate: Date;

  // CLIENTS

  @OneToMany(() => Client, (client) => client.partenaire, {
    eager: true,
    cascade: true,
  })
  clients?: Client[];

  // DATE

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  // COMMUNE

  @Column("text", { nullable: true, name: "commune_code_insee" })
  communeCodeInsee: string;

  @Column("text", { nullable: true, name: "commune_bal_url" })
  communeBalURL: string;

  // ORGANISME

  @Column("enum", {
    enum: PartenaireDeLaCharteOrganismeTypeEnum,
    nullable: true,
    name: "organisme_type",
  })
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum;

  @Column("text", { nullable: true, name: "organisme_info" })
  organismeInfo: string;

  // ENTREPRISE

  @Column("boolean", { nullable: true, name: "entreprise_is_perimeter_france" })
  entrepriseIsPerimeterFrance: boolean;

  @OneToMany(() => Review, (review) => review.partenaire, { eager: true })
  entrepriseReviews?: Relation<Partial<Review>>[];
}
