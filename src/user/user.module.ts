import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OathUser} from "../entity/oathUser.entity";
import {JwtStrategy} from "./interfaces/jwt/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([OathUser])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserModule]
})
export class UserModule {}
