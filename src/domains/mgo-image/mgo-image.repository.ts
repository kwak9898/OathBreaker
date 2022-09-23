import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MgoImage } from "./entities/mgoImage.entity";

@Injectable()
export class MgoImageRepository extends Repository<MgoImage> {
  constructor(private dataSource: DataSource) {
    super(MgoImage, dataSource.createEntityManager());
  }
}
