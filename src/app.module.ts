import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./domains/auth/guards/jwt-auth.guard";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { UsersModule } from "./domains/users/users.module";
import { AuthModule } from "./domains/auth/auth.module";
import { RolesModule } from "./domains/roles/roles.module";
import { MgObjectModule } from "./domains/mg-object/mg-object.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DatabaseModule,
    MgObjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
