import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";
import { User } from "../entities/user.entity";
import { ConnectLog } from "../../connect-logs/entities/connect-log.entity";

export class UserListResponseDto extends OmitType(User, [
  "logList",
  "updatedAt",
  "deletedAt",
  "createdAt",
]) {
  accessAt?: Date;
  user: User;

  constructor(partial?: Partial<User>) {
    super();
    return omit(partial, ["logList", "updatedAt", "deletedAt", "createdAt"]);
  }

  static accessAtIsNull(logList: ConnectLog[]) {
    return logList.length == 0 ? undefined : logList[0].accessAt;
  }
}
