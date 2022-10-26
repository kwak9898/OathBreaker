import { ConnectLog } from "../entities/connect-log.entity";
import { OmitType } from "@nestjs/swagger";
import { omit } from "../../../utils/dto.utils";

export class ConnectLogListResponseDto extends OmitType(ConnectLog, [
  "logId",
  "user",
  "ip",
  "accessAt",
  "updatedAt",
  "deletedAt",
]) {
  logId: number;
  userId: string;
  username: string;
  ip: string;
  url: string;
  accessAt: string;

  constructor(partial?: Partial<ConnectLog>) {
    super();
    return omit(partial, [
      "logId",
      "user",
      "ip",
      "accessAt",
      "updatedAt",
      "deletedAt",
    ]);
  }
}
