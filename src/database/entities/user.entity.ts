import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity("oath_user", { schema: "public" })
export class User {
  @PrimaryColumn("character varying", {
    name: "user_id",
    comment: "회원 아이디",
  })
  userId: string;
  @Exclude({ toPlainOnly: true })
  @Column("character varying", {
    name: "password",
    comment: "패스워드",
    nullable: true,
    select: false,
  })
  password: string | null;
  @Column("character varying", {
    name: "jwt_token",
    comment: "jwt refresh token",
    nullable: true,
    select: false,
  })
  jwtToken: string | null;
  @Column("character varying", {
    name: "username",
    comment: "관리자 이름",
    nullable: true,
  })
  username: string | null;
  @Column("character varying", {
    name: "team",
    comment: "소속",
    nullable: true,
  })
  team: string | null;
  @Column("character varying", {
    name: "role_name",
    comment: "역할",
    nullable: true,
  })
  roleName: string | null;
  @Column("timestamp without time zone", {
    name: "created_at",
    comment: "생성일",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
  @Column("timestamp without time zone", {
    name: "updated_at",
    comment: "수정일",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;
  @Column("timestamp without time zone", {
    name: "deleted_at",
    comment: "삭제일",
    nullable: true,
  })
  deletedAt: Date | null;
  @Column("timestamp without time zone", {
    name: "last_access_at",
    comment: "최근 접속일",
    nullable: true,
  })
  LastAccessAt: Date | null;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  @BeforeUpdate()
  async updateDate(): Promise<void> {
    this.updatedAt = await new Date();
  }

  async setEncryptPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 12);
  }

  async comparePw(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
