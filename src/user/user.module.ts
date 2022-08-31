import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {user} from "../entity/user.entity";
import {JwtStrategy} from "./interfaces/jwt/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([user])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserModule]
})
export class UserModule {}
