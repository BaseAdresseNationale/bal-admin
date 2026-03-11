import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import type { Relation as RelationType } from "typeorm";
import { PartenaireDeLaCharte } from "../entity";
import { Perimeter } from "./pertimeters/entity";

export enum ClientTypeEnum {
  API_DEPOT = "api-depot",
  MOISSONNEUR_BAL = "moissonneur-bal",
}

@Entity({ name: "clients" })
export class Client {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("text", { nullable: false })
  name: string;

  @Index("IDX_clients_client_id")
  @Column("varchar", { length: 24, name: "client_id", nullable: false })
  clientId: string;

  @Index("IDX_clients_partenaire_id")
  @Column("varchar", { length: 24, name: "partenaire_id", nullable: true })
  partenaireId: string;

  @ManyToOne(() => PartenaireDeLaCharte, (e) => e.clients, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "partenaire_id" })
  partenaire: RelationType<PartenaireDeLaCharte>;

  @Column("enum", {
    enum: ClientTypeEnum,
    default: ClientTypeEnum.API_DEPOT,
    nullable: false,
  })
  type: ClientTypeEnum;

  @OneToMany(() => Perimeter, (perimeter) => perimeter.client, {
    eager: true,
    cascade: true,
  })
  perimeters?: Relation<Perimeter>[];

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
}
