import { MyPaginationQuery } from "../../../base/pagination-query";
import { IsNotEmpty, IsString } from "class-validator";

export class AssignMgPaginationQuery implements MyPaginationQuery {
  limit: number | string = 10;
  page: number | string = 1;

  @IsNotEmpty()
  @IsString()
  userId: string;

  startDate?: Date;
  endDate?: Date;
}
