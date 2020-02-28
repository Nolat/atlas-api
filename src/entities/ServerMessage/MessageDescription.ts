import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";

import ServerMessage from "./ServerMessage";

@Entity()
export default class MessageDescription extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ServerMessage)
  serverMessage: ServerMessage;

  @Column({ type: "text", nullable: true })
  title: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "int", default: 0 })
  order: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
