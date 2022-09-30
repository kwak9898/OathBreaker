import { BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { BaseEntity } from "../../base/base.entity";
import { Role } from "../../roles/enum/role.enum";

@Entity("oath_user", { schema: "public" })
export class User extends BaseEntity {
  @PrimaryColumn("character varying", {
    name: "user_id",
    comment: "회원 아이디",
    unique: true,
  })
  userId: string;

  @Exclude({ toPlainOnly: true })
  @Column("character varying", {
    name: "password",
    comment: "패스워드",
    nullable: true,
    select: false,
  })
  password?: string;
  @Column("character varying", {
    name: "jwt_token",
    comment: "jwt refresh token",
    nullable: true,
    select: false,
  })
  jwtToken?: string;
  @Column("character varying", {
    name: "username",
    comment: "관리자 이름",
    nullable: true,
  })
  username?: string;
  @Column("character varying", {
    name: "team",
    comment: "소속",
    nullable: true,
  })
  team?: string;
  @Column({
    type: "enum",
    enum: Role,
    name: "role_name",
    comment: "역할",
    nullable: false,
    default: Role.choose,
  })
  roleName?: string;

  @Column("timestamp without time zone", {
    name: "first_access_at",
    comment: "접속 시간",
    nullable: true,
  })
  firstAccessAt?: Date;

  @Column("timestamp without time zone", {
    name: "last_access_at",
    comment: "최근 접속일",
    nullable: true,
  })
  lastAccessAt?: Date;

  @Column("character varying", {
    name: "url",
    comment: "접근 페이지",
    nullable: true,
  })
  url?: string;

  @Column("character varying", {
    name: "ip",
    comment: "ip 주소",
    nullable: true,
  })
  ip?: string;

  async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 12);
  }

  @BeforeUpdate()
  async updateDate(): Promise<void> {
    this.updatedAt = await new Date();
  }

  async comparePw(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
