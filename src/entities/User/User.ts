import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";

// * Entity
import { Faction, Experience, UserTitle } from "entities";

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn({ type: "text" })
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  username: string;

  @Field(() => UserTitle, { nullable: true })
  @OneToMany(
    () => UserTitle,
    userTitle => userTitle.user
  )
  titles: UserTitle[];

  @Field(() => Faction, { nullable: true })
  @ManyToOne(() => Faction, { onDelete: "SET NULL", nullable: true })
  faction: Faction | null | undefined;

  @Field(() => String, { nullable: true })
  @Column({ type: "timestamp with time zone", nullable: true })
  joinedFactionAt: string | null;

  @Field(() => Number)
  @Column({ type: "int", default: 100 })
  money: number;

  @Field(() => Number, { nullable: true })
  async experience(): Promise<number | undefined> {
    const experience = await Experience.findOne({
      where: { faction: this.faction, user: this }
    });

    return experience ? experience.value : undefined;
  }

  @Field(() => Number, { nullable: true })
  async level(): Promise<number | undefined> {
    const experience = await Experience.findOne({
      where: { faction: this.faction, user: this }
    });

    return experience ? experience.level : undefined;
  }

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
