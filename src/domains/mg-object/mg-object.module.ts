import { Module } from "@nestjs/common";
import { MgObjectService } from "./mg-object.service";
import { MgObjectController } from "./mg-object.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgObject } from "./entities/mg-object.entity";
import { MgObjectRepository } from "./mg-object.repository";
import { MgoImageModule } from "../mgo-image/mgo-image.module";

@Module({
  imports: [TypeOrmModule.forFeature([MgObject]), MgoImageModule],
  providers: [MgObjectService, MgObjectRepository],
  exports: [MgObjectService],
  controllers: [MgObjectController],
})
export class MgObjectModule {}
