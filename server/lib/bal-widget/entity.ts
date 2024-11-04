import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum TypeBalWidgetEnum {
  PUBLISHED = "published",
  DRAFT = "draft",
}

export interface BALWidgetLink {
  label: string;
  url: string;
}

@Entity({ name: "bal-widget" })
export class BalWidget {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("enum", { enum: TypeBalWidgetEnum, nullable: false })
  type: TypeBalWidgetEnum;

  @Column("json", { nullable: true })
  global: {
    title: string;
    hideWidget: boolean;
    showOnPages: string[];
  };

  @Column("json", { nullable: true })
  communes: {
    welcomeBlockTitle: string;
    outdatedApiDepotClients: string[];
    outdatedHarvestSources: string[];
  };

  @Column("json", { nullable: true })
  gitbook: Object;

  @Column("json", { nullable: true, name: "contact_us" })
  contactUs: {
    welcomeBlockTitle: string;
    subjects: string[];
  };

  @Column("json", { nullable: true, name: "gitbook_communes" })
  gitbookCommunes: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };

  @Column("json", { nullable: true, name: "gitbook_particulier" })
  gitbookParticuliers: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
