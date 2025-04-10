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

  @Index("IDX_reviews_partenaire_id")
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

  @Column("text", { nullable: false, name: "verification_token" })
  verificationToken: string = Math.random().toString(36).slice(2);

  @Column("bool", { nullable: false, name: "is_anonymous", default: false })
  isAnonymous?: boolean = false;

  @Column("int", { nullable: false })
  rating: number;

  @Column("text", { nullable: false })
  comment: string;

  @Column("text", { nullable: true })
  reply?: string;

  @Column("bool", {
    nullable: false,
    name: "is_email_verified",
    default: false,
  })
  isEmailVerified: boolean = false;

  @Column("bool", { nullable: false, name: "is_published", default: false })
  isPublished: boolean = false;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
}
