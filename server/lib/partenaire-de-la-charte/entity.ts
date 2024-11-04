import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum TypePartenaireDeLaCharteEnum {
  COMMUNE = "commune",
  ORGANISME = "organisme",
  ENTREPRISE = "entreprise",
}

@Entity({ name: "partenaire_de_la_charte" })
export class PartenaireDeLaCharte {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

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
    enum: TypePartenaireDeLaCharteEnum,
    default: TypePartenaireDeLaCharteEnum.COMMUNE,
    nullable: false,
  })
  type: TypePartenaireDeLaCharteEnum;

  @Column("text", { nullable: true })
  charteURL: string;

  @Column("text", { nullable: true })
  link: string;

  @Column("text", { nullable: true, array: true, name: "code_departement" })
  codeDepartement: string[];

  @Column("text", { nullable: true, array: true })
  service: string[];

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

  @Column("text", { nullable: true, name: "orgnisme_type" })
  organismeType: string;

  @Column("text", { nullable: true })
  infos: string;

  @Column("text", { nullable: true })
  perimeter: string;

  // ENTRPRISE

  @Column("boolean", { nullable: true, name: "is_petimeter_france" })
  isPerimeterFrance: boolean;
}
