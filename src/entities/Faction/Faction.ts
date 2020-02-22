import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

// * Entities
import { User } from "entities";

@Entity()
@ObjectType()
export default class Faction extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => String)
  @Column({ type: "text" })
  description: string;

  @Field(() => String)
  @Column({ type: "text" })
  color: string;

  @Field(() => String)
  @Column({ type: "text" })
  icon: string;

  @Field(() => Number)
  memberCount(): Promise<number> {
    return User.count({ where: { faction: this } });
  }

  @Field(() => Number)
  @Column({ type: "int", default: 30 })
  maxMember: number;

  @Field(() => Boolean)
  async isJoinable(): Promise<boolean> {
    if ((await this.memberCount()) >= this.maxMember) return false;
    return true;
  }

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
