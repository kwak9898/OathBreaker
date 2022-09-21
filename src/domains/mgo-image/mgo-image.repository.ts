import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MgoImage } from "./entities/mgoImage.entity";

@Injectable()
export class MgoImageRepository extends Repository<MgoImage> {
  constructor(private dataSource: DataSource) {
    super(MgoImage, dataSource.createEntityManager());
  }

  async firstWhere(
    column: string,
    value: string | number,
    operator = "="
  ): Promise<MgoImage> {
    return await this.createQueryBuilder()
      .where(`Team.${column} ${operator} :value`, { value: value })
      .getOne();
  }
}
