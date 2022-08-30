import { Module } from '@nestjs/common';
import { MgImageController } from './mgoImage.controller';
import { MgImageService } from './mgoImage.service';

@Module({
  controllers: [MgImageController],
  providers: [MgImageService]
})
export class MgImageModule {}
