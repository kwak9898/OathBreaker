import { InjectRepository } from "@nestjs/typeorm";
import { AssignMgRepository } from "./assign-mg-repository";
import { User } from "../users/entities/user.entity";
import { AssignMgCountsResponseDto } from "./dto/response/assign-mg-counts-response.dto";
import { paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { MgObjectListResponseDto } from "../mg-object/dto/response/mgobject-list-response.dto";
import { MyPagination } from "../base/pagination-response";
import { AssignMgObject } from "./entities/assign-mg-object";
import { MgObjectService } from "../mg-object/mg-object.service";
import { UserRepository } from "../users/user.repository";
import { Role } from "../roles/enum/role.enum";
import { getRandomInt } from "../../utils/test.utils";
import { AssignMgPaginationQuery } from "./dto/request/assignMgPaginationQuery";

export class AssignMgService {
  constructor(
    @InjectRepository(AssignMgRepository)
    private assignMgRepository: AssignMgRepository,
    private readonly mgObjectService: MgObjectService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async pagination(
    query: AssignMgPaginationQuery,
    user: User
  ): Promise<MyPagination<MgObjectListResponseDto>> {
    const queryBuilder = await this.assignMgRepository
      .createQueryBuilder("amo")
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 0)",
        "image_incomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 1)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 2)",
        "image_temp_cnt"
      )
      .innerJoinAndSelect("amo.mgObject", "mg")
      .where("amo.user_id = :user", { user: user.userId })
      .orderBy("mg.updated_at", "DESC");

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere(
        `${
          query.startDate == query.endDate
            ? `mg.updated_at::date = :startDate`
            : `mg.updated_at::date between :startDate and :endDate`
        }`,
        {
          startDate: query.startDate,
          endDate: query.endDate,
        }
      );
    }

    const results = await paginateRawAndEntities(queryBuilder, query);
    const entities = results[0];
    const raws = results[1];

    const data = entities.items
      .map((item) => new MgObjectListResponseDto(item.mgObject))
      .map((item) => {
        const raw = raws.find((r) => (r as any).amo_mg_id == item.mgId) as any;
        item.imageTotalCnt = Number(raw.image_total_cnt);
        item.imageIncompleteCnt = Number(raw.image_incomplete_cnt);
        item.imageCompleteCnt = Number(raw.image_complete_cnt);
        item.imageTempCnt = Number(raw.image_temp_cnt);
        return item;
      });

    return new MyPagination<MgObjectListResponseDto>(data, entities.meta);
  }

  async countForDashboard(user: User): Promise<AssignMgCountsResponseDto> {
    let completeCount = 0;
    let inCompleteCount = 0;
    let tempCount = 0;

    const totalObjectCnt = await this.assignMgRepository
      .createQueryBuilder("assign_mg_object")
      .where("assign_mg_object.user_id = :user", { user: user.userId })
      .getCount();

    const queryBuilder = this.assignMgRepository.createQueryBuilder("amo");
    queryBuilder
      .select("amo.mg_id")
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id)",
        "image_total_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 0)",
        "image_incomplete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 1)",
        "image_complete_cnt"
      )
      .addSelect(
        "(select count(*) from mgo_image where mgo_image.mg_id = amo.mg_id and mgo_image.status_flag = 2)",
        "image_temp_cnt"
      )
      .groupBy("amo.mg_id")
      .where("amo.user_id = :userId", { userId: user.userId });

    const counts = await queryBuilder.getRawMany();
    for (const count of counts) {
      inCompleteCount += Number(count.image_incomplete_cnt);
      completeCount += Number(count.image_complete_cnt);
      tempCount += Number(count.image_temp_cnt);
    }
    return {
      mgObjectCnt: totalObjectCnt,
      inCompleteCnt: inCompleteCount,
      completeCnt: completeCount,
      tmpCnt: tempCount,
    };
  }

  async assignMgObjectToAdmin(mgObjectId: string) {
    const assign = new AssignMgObject();
    const adminUserList = await this.userRepository.find({
      where: { roleName: Role.admin },
    });
    assign.user = adminUserList[getRandomInt(adminUserList.length - 1)];
    assign.mgObject = await this.mgObjectService.findOneOrFail(mgObjectId);
    return this.assignMgRepository.save(assign);
  }
}
