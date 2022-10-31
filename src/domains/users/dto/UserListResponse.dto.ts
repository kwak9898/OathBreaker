import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";
import { User } from "../entities/user.entity";

export class UserListResponseDto extends OmitType(User, [
  "logList",
  "updatedAt",
  "deletedAt",
  "createdAt",
]) {
  accessAt: Date;

  constructor(partial?: Partial<User>) {
    super();
    return omit(partial, ["logList", "updatedAt", "deletedAt", "createdAt"]);
  }
}
