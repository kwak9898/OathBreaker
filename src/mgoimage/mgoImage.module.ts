import { Module } from '@nestjs/common';
import { MgoImageController } from './mgoImage.controller';
import { MgoImageService } from './mgoImage.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MgoImage} from "../entity/mgoImage.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([MgoImage])
  ],
  controllers: [MgoImageController],
  providers: [MgoImageService]
})
export class MgImageModule {}
