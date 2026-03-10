import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { ObjectId } from "bson";
import { Client } from "../entity";

export enum TypePerimeterEnum {
  COMMUNE = "commune",
  DEPARTEMENT = "departement",
  EPCI = "epci",
}

@Entity({ name: "perimeters" })
export class Perimeter {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @BeforeInsert()
  generatedObjectId?() {
    this.id = new ObjectId().toHexString();
  }

  @Index("IDX_perimeters_client_id")
  @Column("varchar", { length: 24, name: "client_id", nullable: false })
  clientId?: string;

  @Column("enum", {
    enum: TypePerimeterEnum,
    nullable: false,
  })
  type: TypePerimeterEnum;

  @Column("text", { nullable: false })
  code: string;

  @ManyToOne(() => Client, (cdf) => cdf.perimeters, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "client_id" })
  client?: Client;
}
