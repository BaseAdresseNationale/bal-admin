import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export interface BALWidgetLink {
  label: string;
  url: string;
}

export enum SondageQuestionType {
  RATING_5_STARS = "rating-5-stars",
  FREE_TEXT = "free-text",
  YES_NO = "yes-no",
}

export interface SondageQuestion {
  id: string;
  type: SondageQuestionType;
  label: string;
}

export interface Sondage {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  site: string;
  questions: SondageQuestion[];
  gristDocId?: string;
}

@Entity({ name: "bal_widget" })
export class BalWidget {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("json", { nullable: true })
  global: {
    title: string;
    hideWidget: boolean;
  };

  @Column("json", { nullable: true })
  communes: {
    welcomeBlockTitle: string;
    outdatedApiDepotClients: string[];
    outdatedHarvestSources: string[];
  };

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

  @Column("json", { nullable: true, default: [] })
  sondages: Sondage[];

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
