import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
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
  @JoinColumn()
  user: User;

  @Field(() => Faction)
  @ManyToOne(() => Faction)
  @JoinColumn()
  faction: Faction;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  value: number;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  level: number;
}
