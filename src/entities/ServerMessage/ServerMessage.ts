import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export default class ServerMessage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  type: string;

  @Column({ type: "text" })
  idChannel: string;

  @Column({ type: "text", nullable: true })
  idMessage: string | null;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
