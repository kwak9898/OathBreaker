import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MgoImage } from "./entities/mgoImage.entity";
import { MgoImageRepository } from "./mgo-image.repository";
import { MgoImageService } from "./mgo-image.service";
import { MgoImageController } from "./mgo-image.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MgoImage])],
  providers: [MgoImageRepository, MgoImageService],
  exports: [MgoImageService],
  controllers: [MgoImageController],
})
export class MgoImageModule {}
