import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgObject } from "../domains/mg-object/entities/mg-object.entity";
import { MgoImage } from "../domains/mgo-image/entities/mgoImage.entity";
import { MgObjectRepository } from "../domains/mg-object/mg-object.repository";
import { MgoImageRepository } from "../domains/mgo-image/mgo-image.repository";
import { AppInitializeService } from "./app-initialize.service";

@Module({
  imports: [TypeOrmModule.forFeature([MgObject, MgoImage])],
  providers: [MgObjectRepository, MgoImageRepository, AppInitializeService],
  exports: [AppInitializeService],
})
export class AppInitializeModule {}
