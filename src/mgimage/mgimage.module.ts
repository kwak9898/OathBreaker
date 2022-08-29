import { Module } from '@nestjs/common';
import { MgimageService } from './mgimage.service';
import {MgimageController} from "./mgimage.controller";

@Module({
  imports: [],
  controllers : [MgimageController],
  providers: [MgimageService]
})
export class MgimageModule {}
