import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../base/base.entity";

@Entity("oath_role", { schema: "public" })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment", {
    name: "role_id",
    comment: "역할 아이디",
  })
  roleId: number;

  @Column("character varying", {
    name: "role_name",
    comment: "역할",
    nullable: false,
  })
  roleName: string;
}
