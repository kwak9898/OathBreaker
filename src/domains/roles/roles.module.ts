import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { UsersService } from "../users/users.service";
import { RoleRepository } from "../../repositories/role.repository";
import { UserRepository } from "../../repositories/user.repository";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}`,
        },
      }),
    }),
  ],
  providers: [RolesService, UsersService, RoleRepository, UserRepository],
  exports: [RolesService, JwtModule],
  controllers: [RolesController],
})
export class RolesModule {}
