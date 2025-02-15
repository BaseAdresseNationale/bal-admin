import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { PartenaireDeLaCharte } from "../entity";

@Entity({ name: "reviews" })
export class Review {
  @PrimaryColumn("varchar", { length: 24 })
  id: string;

  @Index("IDX_partenaire_de_la_charte__id")
  @Column("varchar", { length: 24, name: "partenaire_id", nullable: false })
  partenaireId: string;

  @ManyToOne(() => PartenaireDeLaCharte, (e) => e.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "partenaire_id" })
  partenaire: Relation<PartenaireDeLaCharte>;

  @Column("text", { nullable: false })
  community: string;

  @Column("text", { nullable: false })
  email: string;

  @Column("text", { nullable: false })
  verificationToken: string = Math.random().toString(36).slice(2);

  @Column("bool", { nullable: true, name: "is_anonymous" })
  isAnonymous?: boolean;

  @Column("int", { nullable: false })
  rating: number;

  @Column("text", { nullable: true })
  comment: string;

  @Column("bool", { nullable: false })
  isEmailVerified: boolean = false;

  @Column("bool", { nullable: false, name: "is_published" })
  isPublished: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
}
