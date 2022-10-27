import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";
import { User } from "../entities/user.entity";

export class UserListResponseDto extends OmitType(User, [
  "log",
  "updatedAt",
  "deletedAt",
  "createdAt",
]) {
  accessAt: any;

  constructor(partial?: Partial<User>) {
    super();
    return omit(partial, ["log", "updatedAt", "deletedAt", "createdAt"]);
  }
}
