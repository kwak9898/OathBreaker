import { Entity, PrimaryColumn } from "typeorm";

@Entity("test_user")
export class UserTest {
  @PrimaryColumn("varchar", {
    name: "user_id",
    comment: "회원 아이디",
  })
  userId: string;
}
