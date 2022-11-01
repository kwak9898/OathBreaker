import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";
import { User } from "../entities/user.entity";

export class UserListResponseDto extends OmitType(User, [
  "logList",
  "updatedAt",
  "deletedAt",
]) {
  accessAt?: Date;

  constructor(partial?: Partial<User>) {
    super();
    const data = omit<UserListResponseDto>(partial, [
      "logList",
      "updatedAt",
      "deletedAt",
    ]);
    data.accessAt =
      partial.logList.length == 0 ? undefined : partial.logList[0]?.accessAt;
    return data;
  }
}
