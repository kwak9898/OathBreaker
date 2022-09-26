import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgoImage } from "./entities/mgoImage.entity";
import { MgoImageRepository } from "./mgo-image.repository";
import { MgoImageService } from "./mgo-image.service";
import { MgoImageController } from "./mgo-image.controller";
import { MgObjectRepository } from "../mg-object/mg-object.repository";

@Module({
  imports: [TypeOrmModule.forFeature([MgoImage])],
  providers: [MgoImageRepository, MgObjectRepository, MgoImageService],
  exports: [MgoImageService],
  controllers: [MgoImageController],
})
export class MgoImageModule {}
