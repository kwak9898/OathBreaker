import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "../../base/base.entity";
import { User } from "../../users/entities/user.entity";

@Entity("oath_log", { schema: "public" })
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn("increment", {
    name: "log_id",
    comment: "로그 아이디",
  })
  logId: number;

  @Column("character varying", {
    name: "url",
    comment: "접근 페이지",
    nullable: true,
  })
  url?: string;

  @Column("character varying", {
    name: "ip",
    comment: "접근 IP",
  })
  ip?: string;

  @Column("timestamp without time zone", {
    name: "first_access_at",
    comment: "접속 시간",
    nullable: true,
  })
  firstAccessAt?: Date;

  @OneToOne(() => User, (user) => user.log)
  @JoinColumn({ name: "user_id" })
  user: User;
}