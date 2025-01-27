import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "../events/entity";

@Entity({ name: "participants" })
export class Participant {
  @PrimaryColumn("varchar", { length: 24 })
  id?: string;

  @Index("IDX_numeros_voie_id")
  @Column("varchar", { length: 24, name: "event_id", nullable: false })
  eventId: string;

  @Column("text", { nullable: false })
  fullname: string;

  @Column("text", { nullable: true })
  community: string;

  @Column("text", { nullable: true })
  function: string;

  @Column("text", { nullable: false })
  email: string;

  @ManyToOne(() => Event, (e) => e.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event?: Event;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
}
