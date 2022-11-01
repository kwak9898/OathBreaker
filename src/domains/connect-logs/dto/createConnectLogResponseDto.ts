import { ConnectLog } from "../entities/connect-log.entity";
import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";

export class CreateConnectLogResponseDto extends OmitType(ConnectLog, [
  "user",
  "updatedAt",
  "deletedAt",
  "createdAt",
]) {
  userId: string;
  userName: string;

  constructor(partial?: Partial<ConnectLog>) {
    super();
    return omit(partial, ["user", "updatedAt", "deletedAt", "createdAt"]);
  }
}
