import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";

// * Entity
import { Faction, TitleBranch } from "entities";

@Entity()
@ObjectType()
export default class Title extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  name: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: "int", nullable: true })
  level: number | null | undefined;

  @Field(() => TitleBranch, { nullable: true })
  @ManyToOne(() => TitleBranch, { nullable: true })
  branch: TitleBranch | null | undefined;

  @Field(() => Faction, { nullable: true })
  @ManyToOne(() => Faction, { nullable: true })
  faction: Faction | null | undefined;

  @Field(() => Title, { nullable: true })
  @ManyToOne(() => Title, { nullable: true })
  parent: Title | null | undefined;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
