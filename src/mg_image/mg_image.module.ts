import { Module } from '@nestjs/common';
import { MgImageController } from './mg_image.controller';
import { MgImageService } from './mg_image.service';

@Module({
  controllers: [MgImageController],
  providers: [MgImageService]
})
export class MgImageModule {}
