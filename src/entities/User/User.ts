import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

// * Entity
import { Faction } from "entities";

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn({ type: "text" })
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  username: string;

  @Field(() => Faction, { nullable: true })
  @ManyToOne(() => Faction, { onDelete: "SET NULL", nullable: true })
  @JoinColumn()
  faction: Faction | null | undefined;

  @Field(() => String, { nullable: true })
  @Column({ type: "timestamp with time zone", nullable: true })
  joinedFactionAt: string | null;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
