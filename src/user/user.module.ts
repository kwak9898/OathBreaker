import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { JwtStrategy } from "./interfaces/jwt/jwt.strategy";
import { LocalStrategy } from "./interfaces/auth/local.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, LocalStrategy],
  exports: [UserModule],
})
export class UserModule {}
