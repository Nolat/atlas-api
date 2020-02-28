import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Column
} from "typeorm";

// * Entity
import { User, Title } from "entities";

@Entity()
@ObjectType()
export default class UserTitle extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.titles
  )
  user: User;

  @Field(() => Title)
  @ManyToOne(() => Title)
  title: Title;

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  isEnabled: boolean;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
