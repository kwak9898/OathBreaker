import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "../../strategies/local.strategy";
import { JwtStrategy } from "../../strategies/jwt.strategy";
import { JwtRefreshStrategy } from "../../strategies/jwtRefresh.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get(
            "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
          )}s`,
        },
      }),
    }),
  ],
  providers: [RolesService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [RolesService, JwtModule],
  controllers: [RolesController],
})
export class RolesModule {}
