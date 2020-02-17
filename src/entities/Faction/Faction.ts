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
  id: number;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => String)
  @Column({ type: "text" })
  description: string;

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

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}
