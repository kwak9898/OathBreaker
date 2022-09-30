import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignMgObject } from "./entities/assign-mg-object";
import { AssignMgRepository } from "./assign-mg-repository";
import { AssignMgService } from "./assign-mg-service";
import { AssignMgController } from "./assign-mg-controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([AssignMgObject]), UsersModule],
  providers: [AssignMgRepository, AssignMgService],
  exports: [AssignMgService],
  controllers: [AssignMgController],
})
export class AssignMgObjectModule {}
