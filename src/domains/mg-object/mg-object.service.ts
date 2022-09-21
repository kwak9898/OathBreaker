import { MgObjectRepository } from "./mg-object.repository";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { MgObject } from "./entities/mg-object.entity";

export class MgObjectService {
  constructor(
    @InjectRepository(MgObjectRepository) private repository: MgObjectRepository
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<MgObject>> {
    return paginate<MgObject>(this.repository, options);
  }
}
