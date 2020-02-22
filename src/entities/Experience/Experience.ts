import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany
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
  @OneToMany(
    type => User,
    user => user.experience
  )
  user: User;

  @Field(() => Faction)
  @JoinColumn()
  @OneToMany(
    type => Faction,
    faction => faction.id
  )
  faction: Faction;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  value: number;
}
