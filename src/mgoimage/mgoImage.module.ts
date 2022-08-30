import { Module } from '@nestjs/common';
import { MgoImageController } from './mgoImage.controller';
import { MgoImageService } from './mgoImage.service';

@Module({
  controllers: [MgoImageController],
  providers: [MgoImageService]
})
export class MgImageModule {}
