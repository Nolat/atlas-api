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
  @JoinColumn()
  @ManyToOne(
    type => User,
    user => user.getExperience()
  )
  user: User;

  @Field(() => Faction)
  @JoinColumn()
  @ManyToOne(
    type => Faction,
    faction => faction.id
  )
  faction: Faction;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  value: number;
}
