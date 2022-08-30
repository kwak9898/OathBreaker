import { Module } from '@nestjs/common';
import { OathUserController } from './oathUser.controller';
import { OathUserService } from './oathUser.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OathUser} from "../entity/oathUser.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OathUser])],
  controllers: [OathUserController],
  providers: [OathUserService],
  exports: [OathUserModule]
})
export class OathUserModule {}
