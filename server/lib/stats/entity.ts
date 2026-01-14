import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "stats" })
export class Stats {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Column("varchar", { nullable: false })
  name: string;

  @Column("json", { nullable: false })
  value: Object;
}
