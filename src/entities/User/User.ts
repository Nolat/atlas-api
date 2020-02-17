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

  @Field(() => Faction)
  @ManyToOne(() => Faction, { onDelete: "SET NULL" })
  @JoinColumn()
  faction: Faction;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}
