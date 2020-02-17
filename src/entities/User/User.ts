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
  faction: Faction | undefined;

  @Field(() => String, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  joinedFactionAt: string | undefined;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;
}
