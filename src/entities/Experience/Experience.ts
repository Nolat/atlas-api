import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

// * Entity
import { User, Faction } from "entities";

@Entity()
@ObjectType()
export default class Experience extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => Faction)
  @ManyToOne(() => Faction)
  faction: Faction;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  value: number;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  level: number;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
