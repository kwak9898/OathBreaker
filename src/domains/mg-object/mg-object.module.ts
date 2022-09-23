import { Module } from "@nestjs/common";
import { MgObjectService } from "./mg-object.service";
import { MgObjectController } from "./mg-object.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgObject } from "./entities/mg-object.entity";
import { MgObjectRepository } from "./mg-object.repository";
import { MgoImageModule } from "../mgo-image/mgo-image.module";
import { MgoImageRepository } from "../mgo-image/mgo-image.repository";

@Module({
  imports: [TypeOrmModule.forFeature([MgObject]), MgoImageModule],
  providers: [MgObjectService, MgObjectRepository, MgoImageRepository],
  exports: [MgObjectService],
  controllers: [MgObjectController],
})
export class MgObjectModule {}
