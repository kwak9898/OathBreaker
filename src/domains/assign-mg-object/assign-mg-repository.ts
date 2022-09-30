import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AssignMgObject } from "./entities/assign-mg-object";

@Injectable()
export class AssignMgRepository extends Repository<AssignMgObject> {
  constructor(private dataSource: DataSource) {
    super(AssignMgObject, dataSource.createEntityManager());
  }
}
