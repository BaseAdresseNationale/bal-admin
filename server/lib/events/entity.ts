import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum EventTypeEnum {
  FORMATION = "formation",
  FORMATION_LVL2 = "formation-lvl2",
  PARTENAIRE = "partenaire",
  ADRESSE_LAB = "adresselab",
  ADRESSE_REGION = "adresse-region",
  PRESENTATION = "présentation",
}

export enum EventTagEnum {
  PROGRAMME_BAL = "Programme Base Adresse Locale",
  BAL = "Base Adresse Locale",
  COMMUNE = "Commune",
  BAN = "Base Adresse Nationale",
  GOUVERNANCE = "Gouvernance",
  ADRESSE = "Adresse",
  REFERENTIELS = "Referentiel",
  CO_CONSTRUCTION = "Co construction",
  ADRESSE_LAB = "Adresse_Lab",
  TECHNIQUE = "Technique",
  AGILE = "Agile",
  UTILISATEURS = "Utilisateurs",
}

@Entity({ name: "events" })
export class Event {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("text", { nullable: false })
  title: string;

  @Column("text", { nullable: true })
  subtitle: string;

  @Column("text", { nullable: false })
  description: string;

  @Column("enum", {
    enum: EventTypeEnum,
    nullable: false,
  })
  type: EventTypeEnum;

  @Column("text", { nullable: false })
  target: string;

  @Column("timestamp", { nullable: true })
  date: Date;

  @Column("enum", { enum: EventTagEnum, nullable: false, array: true })
  tags: EventTagEnum[];

  @Column("boolean", { nullable: false, name: "is_online_only" })
  isOnlineOnly: boolean;

  @Column("json", { nullable: true })
  address: Object;

  @Column("text", { nullable: true })
  href: string;

  @Column("boolean", { nullable: false, name: "is_subscription_closed" })
  isSubscriptionClosed: boolean;

  @Column("text", { nullable: true })
  instructions: string;

  @Column("text", { nullable: false })
  startHour: string;

  @Column("text", { nullable: false })
  endHour: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
