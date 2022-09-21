import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MgObject } from "./entities/mg-object.entity";

@Injectable()
export class MgObjectRepository extends Repository<MgObject> {
  constructor(private dataSource: DataSource) {
    super(MgObject, dataSource.createEntityManager());
  }

  async firstWhere(
    column: string,
    value: string | number,
    operator = "="
  ): Promise<MgObject> {
    return await this.createQueryBuilder()
      .where(`Team.${column} ${operator} :value`, { value: value })
      .getOne();
  }
}
