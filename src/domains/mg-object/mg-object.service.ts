import { MgObjectRepository } from "./mg-object.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { MgObject } from "./entities/mg-object.entity";
import { MyPaginationQuery } from "../../dacorators/PaginateQuery";

export class MgObjectService {
  constructor(
    @InjectRepository(MgObjectRepository) private repository: MgObjectRepository
  ) {}

  async totalCount(): Promise<number> {
    return this.repository.count();
  }

  async paginate(options: MyPaginationQuery): Promise<Pagination<MgObject>> {
    const queryBuilder = this.repository.createQueryBuilder("mgObject");
    if (options.search) {
      queryBuilder
        .where("mgObject.mgName = :mgName", { mgName: options?.search ?? "" })
        .orWhere("mgObject.mgId = :mgId", { mgId: options?.search ?? "" });
    }
    return paginate<MgObject>(queryBuilder, options);
  }
}
